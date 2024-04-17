import { Injectable } from "@nestjs/common";
import { Competency, CompetencyLevel, Designation, Role } from "@prisma/client";
import axios from "axios";
import _ from "lodash";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class TarentoService {
  constructor(private prisma: PrismaService) {}
  private fracApiUrl = process.env.FRAC_SERVICE_URL;

  async getAllUsers(): Promise<any> {
    try {
      const baseUrl = process.env.USER_SERVICE_URL || "";
      if (baseUrl == "") {
        throw new Error("User service URL not available");
      }
      const headers = {
        Authorization: "bearer " + process.env.USER_SERVICE_TOKEN,
        "Content-Type": "application/json",
      };

      const data = {
        request: {
          filters: {},
        },
      };

      let response = await axios.post(baseUrl, data, { headers });

      if (response.data.result.response.content.lenght < 1) {
        throw new Error("Zero users fetched.");
      }

      return response.data.result.response.content;
    } catch (error) {
      // Handle errors
      console.log(error);
      throw new Error("Failed to fetch user data from the Tarento's API");
    }
  }

  async getUser(userId: string): Promise<any> {
    try {
      const baseUrl = process.env.USER_SERVICE_URL || "";
      if (baseUrl == "") {
        throw new Error("User service URL not available");
      }
      const headers = {
        Authorization: "bearer " + process.env.USER_SERVICE_TOKEN,
        "Content-Type": "application/json",
      };

      const data = {
        request: {
          filters: {
            id: userId,
          },
        },
      };

      let response = await axios.post(baseUrl, data, { headers });

      return response;
    } catch (error) {
      // Handle errors
      console.log(error);
      throw new Error("Failed to fetch user data from the Tarento's API");
    }
  }

  async getFracData(): Promise<any> {
    try {
      const response = await axios.get(`${this.fracApiUrl}`, {
        headers: {
          Accept: "application/json",
          "Accept-Language": "en-GB,en;q=0.9",
          Cookie:
            "connect.sid=s%3A3R7JwXRshJ5kaAM2AoHznye9VSbWIoks.CTD%2BcCE9y%2FDYcQ6FhBS5Fi2cFbl5h9SAIA51Me%2FzU3g",
        },
      });
      return response.data.result.framework.categories;
    } catch (error) {
      // Handle errors
      throw new Error("Failed to fetch FRAC data from the Tarento's API");
    }
  }

  async formatAndSyncFracData(): Promise<any> {
    try {
      const fracData = await this.getFracData();

      await this.prisma.$transaction(async (prismaClient) => {
        //sync designations(positions)
        const designations = _.find(fracData, {
          name: "Positions",
          status: "Live",
        });
        const syncedDesignations: Designation[] = [];

        for (const position of designations.terms) {
          if (position.status === "Live") {
            const designationDTO = {
              name: position.name,
              description: position.description,
            };

            try {
              const result = await prismaClient.designation.upsert({
                where: {
                  name: designationDTO.name,
                },
                create: designationDTO,
                update: designationDTO,
              });
              syncedDesignations.push(result);
            } catch (error) {
              console.error("Error upserting designation:", error);
              throw new Error(error);
            }
          }
        }

        // console.log("syncedDesignations", syncedDesignations);

        //sync roles
        const roles = _.find(fracData, { name: "Roles", status: "Live" });
        const syncedRoles: Role[] = [];

        for (const role of roles.terms) {
          if (role.status === "Live") {
            const roleDTO = {
              name: role.name,
              description: role.description,
            };

            try {
              const syncedRole = await prismaClient.role.upsert({
                where: {
                  name: roleDTO.name,
                },
                create: roleDTO,
                update: roleDTO,
              });
              syncedRoles.push(syncedRole);
            } catch (error) {
              console.error("Error upserting role:", error);
              throw new Error(error);
            }
          }
        }

        // console.log("syncedRoles", syncedRoles);

        //map designatioToRoles
        for (const position of designations.terms) {
          if (position.associations.length > 0) {
            const positionToBeMapped = _.find(syncedDesignations, {
              name: position.name,
              description: position.description,
            });
            // console.log("positionToBeMapped: ", positionToBeMapped);

            for (const roleToBeMapped of position.associations) {
              // console.log("roleToBeMapped: ", roleToBeMapped);
              if (roleToBeMapped.status == "Live") {
                const roleAdded = await prismaClient.role.findUnique({
                  where: {
                    name: roleToBeMapped.name,
                    description: roleToBeMapped.description,
                  },
                });
                // console.log("roleBeingMapped: ", roleAdded);

                if (roleAdded != null && positionToBeMapped != null) {
                  let designationId = positionToBeMapped.id;
                  let roleId = roleAdded.id;

                  console.log(
                    "designationToBeMapped: ",
                    positionToBeMapped.name
                  );
                  console.log("roleBeingMapped: ", roleAdded.name);

                  try {
                    await prismaClient.designationToRole.upsert({
                      where: {
                        designationId_roleId: {
                          designationId,
                          roleId,
                        },
                      },
                      update: {
                        designationId,
                        roleId,
                      },
                      create: {
                        designationId,
                        roleId,
                      },
                    });
                  } catch (error) {
                    console.error(
                      "Error syncing competenciesToCompetencyLevels:",
                      error
                    );
                    throw new Error(error);
                  }
                }
              }
            }
          }
        }

        console.log("Successfully mapped designatioToRoles");

        //sync competencyLevels
        const competencyLevels = _.find(fracData, {
          name: "Competency Levels",
          status: "Live",
        });
        const syncedCompetencyLevels: CompetencyLevel[] = [];

        for (const competencyLevel of competencyLevels.terms) {
          if (competencyLevel.status === "Live") {
            const competencyLevelDTO = {
              name: competencyLevel.name,
              description: competencyLevel.description,
              levelNumber:
                competencyLevel.moreProperties.levelNumber ||
                competencyLevel.index,
            };

            try {
              const upsertResult = await prismaClient.competencyLevel.upsert({
                where: {
                  name: competencyLevelDTO.name,
                },
                create: competencyLevelDTO,
                update: competencyLevelDTO,
              });

              syncedCompetencyLevels.push(upsertResult);
            } catch (error) {
              console.error("Error upserting role:", error);
              throw new Error(error);
            }
          }
        }

        // console.log("syncedCompetencyLevels", syncedCompetencyLevels);

        //sync competencies
        const competencies = _.find(fracData, {
          name: "Competencies",
          status: "Live",
        });
        const syncedCompetencies: Competency[] = [];
        for (const competency of competencies.terms) {
          if (competency.status === "Live") {
            const competencyDTO = {
              name: competency.name,
              description: competency.description,
            };

            try {
              const result = await prismaClient.competency.upsert({
                where: {
                  name: competencyDTO.name,
                },
                create: competencyDTO,
                update: competencyDTO,
              });

              syncedCompetencies.push(result);
            } catch (error) {
              console.error("Error upserting competency:", error);
              throw new Error(error);
            }
          }
        }

        // console.log("syncedCompetency", syncedCompetency);

        //map competenciesToCompetencyLevels
        await Promise.all(
          competencies.terms.map(async (competency) => {
            if (competency.associations && competency.associations.length > 0) {
              const competencyToBeMapped = _.find(syncedCompetencies, {
                name: competency.name,
                description: competency.description,
              });
              competency.associations.forEach(
                async (competencyLevelToBeMapped) => {
                  if (competencyLevelToBeMapped.status == "Live") {
                    const competencyLevelAdded = _.find(
                      syncedCompetencyLevels,
                      {
                        name: competencyLevelToBeMapped.name,
                      }
                    );
                    if (competencyLevelAdded && competencyToBeMapped) {
                      const competencyId = competencyToBeMapped?.id;
                      const competencyLevelId = competencyLevelAdded?.id;

                      try {
                        await prismaClient.competencyToCompetencyLevel.upsert({
                          where: {
                            competencyId_competencyLevelId: {
                              competencyId,
                              competencyLevelId,
                            },
                          },
                          update: {
                            competencyId,
                            competencyLevelId,
                          },
                          create: {
                            competencyId,
                            competencyLevelId,
                          },
                        });
                      } catch (error) {
                        console.error(
                          "Error syncing competenciesToCompetencyLevels:",
                          error
                        );
                        throw new Error(error);
                      }
                    }
                  }
                }
              );
            }
          })
        );

        console.log("Successfully mapped competenciesToCompetencyLevels");

        //map rolesToCompetencies
        const activities = _.find(fracData, {
          name: "Activities",
          status: "Live",
        });
        for (const role of roles.terms) {
          if (role.associations && role.associations.length > 0) {
            let activitiesToBeAdded: string[] = [];
            const roleToBeMapped = _.find(syncedRoles, {
              name: role.name,
              description: role.description,
            });
            if (roleToBeMapped) {
              for (const activity of role.associations) {
                if (activity.status === "Live") {
                  const activityWithAssociations = _.find(activities.terms, {
                    name: activity.name,
                    description: activity.description,
                  });
                  activitiesToBeAdded.push(activity.name);
                  if (
                    activityWithAssociations &&
                    activityWithAssociations.associations &&
                    activityWithAssociations.associations.length > 0
                  ) {
                    for (const competency of activityWithAssociations.associations) {
                      if (competency.status === "Live") {
                        const competencyAdded = _.find(syncedCompetencies, {
                          name: competency.name,
                        });
                        if (competencyAdded) {
                          const roleId = roleToBeMapped.id;
                          const competencyId = competencyAdded.id;

                          try {
                            await prismaClient.roleToCompetency.upsert({
                              where: {
                                roleId_competencyId: {
                                  roleId,
                                  competencyId,
                                },
                              },
                              update: {
                                roleId,
                                competencyId,
                              },
                              create: {
                                roleId,
                                competencyId,
                              },
                            });
                          } catch (error) {
                            console.error(
                              "Error syncing rolesToCompetencies:",
                              error
                            );
                            throw new Error(error);
                          }
                        }
                      }
                    }
                  }
                }
              }
              console.log("activitiesToBeAdded: ", activitiesToBeAdded);
              await prismaClient.role.update({
                where: {
                  id: roleToBeMapped.id,
                },
                data: {
                  activities: activitiesToBeAdded,
                },
              });
            }
          }
        }
        console.log("Successfully mapped rolesToCompetencies");
        console.log("Successfully mapped activities to roles");
      });

      return "FRAC data synced successfully";
    } catch (error) {
      throw new Error(error);
    }
  }
}
