import { RobotPosition } from "@/presets/types/robotPosition";
import { Euler, Quaternion, Scene, Vector3 } from "three";

export function robotToThreeJsPosition(robotCoordinates: RobotPosition): {
    position: Vector3;
    quaternion: Quaternion;
} {
    const position = new Vector3(robotCoordinates.x / 1000, robotCoordinates.z / 1000, -robotCoordinates.y / 1000);
    const quaternion = new Quaternion();
    quaternion.setFromEuler(new Euler(robotCoordinates.yaw * Math.PI / 180, 0, 0, 'YXZ'));



    return {
        position,
        quaternion,
    };

}

export function threeJsToRobotPosition(threeJsCoordinates: Vector3, quaternion: Quaternion): RobotPosition {

    const euler = new Euler();

    euler.setFromQuaternion(quaternion, 'YXZ');

    const yaw = euler.y;
    const yawInDegrees = yaw * 180 / Math.PI;


    return {
        x: threeJsCoordinates.z * 1000,
        y: threeJsCoordinates.x * 1000,
        z: threeJsCoordinates.y * 1000,
        yaw: yawInDegrees,
    };
}

export function getGripperPosition(scene: Scene): RobotPosition {
    const gripper = scene.getObjectByName('gripper');

    if (!gripper) {
        throw new Error('Gripper not found');
    }

    const gripperWorldPosition = new Vector3();
    gripper.getWorldPosition(gripperWorldPosition);

    const origin = scene.getObjectByName('workAreaOrigin');

    if (!origin) {
        throw new Error('Origin not found');
    }

    const originWorldPosition = new Vector3();
    origin.getWorldPosition(originWorldPosition);

    const relativePosition = gripperWorldPosition.clone().sub(originWorldPosition);


    const gripperWorldQuaternion = new Quaternion();
    gripper.getWorldQuaternion(gripperWorldQuaternion);

    return threeJsToRobotPosition(relativePosition, gripperWorldQuaternion);

}