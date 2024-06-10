import { Command } from "@/presets/types/recipe"
import { RobotJointStates } from "@/presets/types/robotJointStates"
import { RobotPosition } from "@/presets/types/robotPosition"

export const robotCmd = {
    openGripper: (): Command => {
        return {
            type: "gripper",
            isOpen: true,
        }
    },
    closeGripper: (): Command => {
        return {
            type: "gripper",
            isOpen: false,
        }
    },
    moveToJointState: (jointStates: RobotJointStates): Command => {
        return {
            type: "moveToJointState",
            jointStates: jointStates,
        }
    },
    moveToPosition: (position: RobotPosition): Command => {
        return {
            type: "moveToPosition",
            position: position,
        }
    },
    moveToBlockStorageHigh: (): Command => {
        return {
            type: "moveToBlockStorageHigh",
        }
    },
    moveToBlockStorageLow: (): Command => {
        return {
            type: "moveToBlockStorageLow",
        }
    },
    goHome: (): Command => {
        return {
            type: "moveToJointState",
            jointStates: {
                joint1: 0,
                joint2: 0,
                joint3: 0,
                joint4: 0,
                joint5: -90,
                joint6: 0,
            }
        }
    }
}