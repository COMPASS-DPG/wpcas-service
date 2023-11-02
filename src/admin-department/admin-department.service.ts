import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { FilterAdminDepartmentsDto } from "./dto/create-admin-department.dto";
import { PrismaService } from "../prisma/prisma.service";
import { MockDepartmentService } from "../mockModules/mock-department/mock-department.service";

@Injectable()
export class AdminDepartmentService {
  constructor(
    private prisma: PrismaService,
    private departmentService: MockDepartmentService
  ) {}

  public async createOrUpdateAdminDepartment(id: number) {
    // Check the admin department exist for admin department db or not
    const checkExistingAdminDepartment =
      await this.prisma.adminDepartment.findUnique({
        where: {
          departmentId: id,
        },
      });
    // Check if the department exist in mock department module or not
    const adminDepartment = await this.departmentService.findOne(id);
    // If department does not exist in the department module then throw an error
    if (!adminDepartment) {
      throw new NotFoundException(
        `The Mock Admin Department for the #${id} not found.`
      );
    }
    // If it is existing admin department then update the admin department
    if (checkExistingAdminDepartment) {
      const updatedAdminDepartment = await this.prisma.adminDepartment.update({
        where: {
          departmentId: id,
        },
        data: {
          name: adminDepartment.name,
          description: adminDepartment.description,
        },
      });
      return updatedAdminDepartment;
    }
    return this.prisma.adminDepartment.create({
      data: {
        departmentId: adminDepartment.id,
        name: adminDepartment.name,
        description: adminDepartment.description,
      },
    });
  }

  public async getAllAdminDepartment(filter: FilterAdminDepartmentsDto) {
    const { departmentId, name, limit = 10, offset = 0, surveyConfig } = filter;
    // Get all the admin department and filter using department Id and name.
    return await this.prisma.adminDepartment.findMany({
      where: {
        departmentId: departmentId ?? undefined, // Optional departmentId filter
        name: name ?? undefined, // Optional filter by Name
      },
      skip: offset,
      take: limit,
      select: {
        id: true,
        departmentId: true,
        name: true,
        description: true,
        SurveyConfig:
          surveyConfig == true
            ? {
                select: {
                  id: true,
                  startTime: true,
                  endTime: true,
                  onboardingTime: true,
                  onboardingTimeUnit: true,
                },
              }
            : {},
      },
    });
  }
}
