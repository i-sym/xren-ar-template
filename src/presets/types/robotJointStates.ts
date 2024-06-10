import { z } from "zod";

export const robotJointStatesSchema = z.object({
    joint1: z.number().min(-Math.PI / 2).max(Math.PI / 2),
    joint2: z.number().min(0).max(Math.PI / 2),
    joint3: z.number().min(-Math.PI / 2).max(Math.PI / 2),
    joint4: z.number().min(-Math.PI / 2).max(Math.PI / 2),
    joint5: z.number().min(-Math.PI / 2).max(Math.PI / 2),
    joint6: z.number().min(-Math.PI / 2).max(Math.PI / 2),
});

export type RobotJointStates = z.infer<typeof robotJointStatesSchema>;

export const robotJointStatesOutputSchema = z.object({
    joint1: z.number().min(-90).max(90),
    joint2: z.number().min(0).max(90),
    joint3: z.number().min(-90).max(90),
    joint4: z.number().min(-90).max(90),
    joint5: z.number().min(-90).max(90),
    joint6: z.number().min(-90).max(90),
});

export type RobotJointStatesOutput = z.infer<typeof robotJointStatesOutputSchema>;