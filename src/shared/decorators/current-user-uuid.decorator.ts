import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUserUuid = createParamDecorator(
    (data: undefined, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest()
        return request.user["uuid"]
        
    } 
)