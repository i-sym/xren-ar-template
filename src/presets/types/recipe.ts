import { z } from "zod";
import { robotJointStatesOutputSchema, robotJointStatesSchema } from "./robotJointStates";
import { robotPositionOutputSchema, robotPositionSchema } from "./robotPosition";

export const moveToJointStateCommandSchema = z.object({
    type: z.literal("moveToJointState"),
    jointStates: robotJointStatesOutputSchema,
});

export type MoveToJointStateCommand = z.infer<typeof moveToJointStateCommandSchema>;

export const moveToPositionCommandSchema = z.object({
    type: z.literal("moveToPosition"),
    position: robotPositionOutputSchema,
});

export type MoveToPositionCommand = z.infer<typeof moveToPositionCommandSchema>;

export const gripperCommandSchema = z.object({
    type: z.literal("gripper"),
    isOpen: z.boolean(),
});

export type GripperCommand = z.infer<typeof gripperCommandSchema>;


export const moveToBlockStorageHighCommandSchema = z.object({
    type: z.literal("moveToBlockStorageHigh"),
});

export type MoveToBlockStorageHighCommand = z.infer<typeof moveToBlockStorageHighCommandSchema>;

export const moveToBlockStorageLowCommandSchema = z.object({
    type: z.literal("moveToBlockStorageLow"),
});

export type MoveToBlockStorageLowCommand = z.infer<typeof moveToBlockStorageLowCommandSchema>;


export const commandSchema = z.discriminatedUnion("type", [
    moveToJointStateCommandSchema,
    moveToPositionCommandSchema,
    gripperCommandSchema,
    moveToBlockStorageHighCommandSchema,
    moveToBlockStorageLowCommandSchema,
]);

// Picking from block storage

export type Command = z.infer<typeof commandSchema>;

export const recipeSchema = z.object({
    metadata: z.object({
        name: z.string(),
        version: z.string(),
    }),
    commands: z.array(commandSchema),
});

export type Recipe = z.infer<typeof recipeSchema>;

const sampleRecipe: Recipe = {
    metadata: {
        name: "Sample Recipe",
        version: "1.0",
    },
    commands: [
        {
            type: "moveToPosition",
            position: {
                x: 0,
                y: 0,
                z: 0,
                yaw: 0,
            },
        },
        {
            type: "gripper",
            isOpen: false,
        },
        {
            type: "moveToJointState",
            jointStates: {
                joint1: 0,
                joint2: 0,
                joint3: 0,
                joint4: 0,
                joint5: -45,
                joint6: 0,
            },
        },
        {
            type: "moveToJointState",
            jointStates: {
                joint1: -45,
                joint2: 0,
                joint3: 0,
                joint4: 0,
                joint5: -45,
                joint6: 0,
            },
        },
        {
            type: "moveToJointState",
            jointStates: {
                joint1: 45,
                joint2: 0,
                joint3: 0,
                joint4: 0,
                joint5: -45,
                joint6: 0,
            },
        },
        {
            type: "moveToJointState",
            jointStates: {
                joint1: 0,
                joint2: 0,
                joint3: 0,
                joint4: 0,
                joint5: -45,
                joint6: 0,
            },
        },
        {
            type: "moveToPosition",
            position: {
                x: 0,
                y: 0,
                z: 0,
                yaw: 0,
            },
        },
        {
            type: "gripper",
            isOpen: true,
        },
    ],
};

console.log(JSON.stringify(sampleRecipe, null, 2));