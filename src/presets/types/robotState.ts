import { z } from "zod";
import { recipeSchema } from "./recipe";
import { robotJointStatesSchema } from "./robotJointStates";

export const gripperStateSchema = z.object({
    isOpen: z.boolean(),
});

export const robotStatusSchema = z.object({
    motion: z.enum(["idle", "moving", "error"]),
});

export const robotPathExecutionStatusSchema = z.discriminatedUnion("status", [
    z.object({
        status: z.literal("idle"),
    }),
    z.object({
        status: z.literal("executing"),
        recipe: recipeSchema,
        currentStep: z.number(),
    }),
    z.object({
        status: z.literal("error"),
        message: z.string(),
    }),
]);

export const robotStateSchema = z.object({
    status: robotStatusSchema,
    recipeExecution: robotPathExecutionStatusSchema.optional(),
    jointStates: robotJointStatesSchema,
    gripper: gripperStateSchema,
});



export type RobotState = z.infer<typeof robotStateSchema>;
export type RobotStatus = z.infer<typeof robotStatusSchema>;
export type GripperState = z.infer<typeof gripperStateSchema>;