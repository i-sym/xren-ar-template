import { z } from "zod";


export const robotPositionSchema = z.object({
    x: z.number().max(0.2).min(-0.2),
    y: z.number().max(0.3).min(-0.3),
    z: z.number().max(0.2).min(0),
    yaw: z.number().min(-Math.PI / 2).max(Math.PI / 2),
});

export type RobotPosition = z.infer<typeof robotPositionSchema>;

export const robotPositionOutputSchema = z.object({
    x: z.number().max(200).min(-200),
    y: z.number().max(300).min(-300),
    z: z.number().max(200).min(0),
    yaw: z.number().min(-90).max(90),
});


export type RobotPositionOutput = z.infer<typeof robotPositionOutputSchema>;