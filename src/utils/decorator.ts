import { ApiProperty, ApiPropertyOptions } from "@nestjs/swagger";

// Decorator to document enum properties in Swagger
// @param enumObject: The enum object to document
// @param options: An object with options for the decorator (including isOptional)
export function IsSwaggerEnum(
  enumObject: Record<string, string>,
  options: {
    isOptional?: boolean;
    apiPropertyOptions?: ApiPropertyOptions; // Additional decorator options for ApiProperty
  } = {}
) {
  return (target: any, propertyKey: string) => {
    const { isOptional = false, apiPropertyOptions = {} } = options; // Destructure options

    // Get the enum values from the provided enumObject
    const values = Object.values(enumObject);

    // Create decorator options for ApiProperty
    const decoratorOptions = {
      type: enumObject, // Use the cloned enumObject
      enum: values, // Specify the enum values
      ...apiPropertyOptions, // Merge additional ApiProperty options
    };

    // If the property is not optional, add the example property
    if (!isOptional) {
      decoratorOptions.example = values.join(" || "); // Set an example enum value for documentation purposes
    }

    // If the property is optional, mark it as such in Swagger documentation
    if (isOptional) {
      decoratorOptions["required"] = false;
    }

    // Apply the ApiProperty decorator with the specified options to the property
    ApiProperty(decoratorOptions)(target, propertyKey);
  };
}
