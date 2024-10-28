import * as CANNON from "cannon-es";

export function initPhysicsWorld() {
    const world = new CANNON.World();
    world.gravity.set(0, 0, 0);
    return world;
}

export function setMinimumVelocity(body, minVelocity) {
    const velocityMagnitude = body.velocity.length();
    if (velocityMagnitude < minVelocity) {
        const scaleFactor = minVelocity / velocityMagnitude;
        body.velocity.scale(scaleFactor);
    }
}

export function checkBoundsAndBounce(body, boundarySize) {
    const { x, y, z } = body.position;
    if (x < -boundarySize || x > boundarySize) body.velocity.x *= -1;
    if (y < -boundarySize || y > boundarySize) body.velocity.y *= -1;
    if (z < -boundarySize || z > boundarySize) body.velocity.z *= -1;
}

export function updatePhysicsObjects(scene, world) {
    scene.traverse((child) => {
        if (child.isGroup && child.userData.physicsBody) {
            const body = child.userData.physicsBody;
            checkBoundsAndBounce(body, 800); // Usa il valore del boundarySize
            
           // setMinimumVelocity(body, 5); // Usa il valore di minVelocity
            child.position.copy(body.position);
            child.quaternion.copy(body.quaternion);


            if (body && child.userData.boxHelper) {
                child.userData.boxHelper.position.copy(body.position);
                child.userData.boxHelper.quaternion.copy(body.quaternion);  // Mantiene la stessa rotazione
            }
            //child.userData.boxHelper.update();
        }
    });
}
