import * as ECS from "lofi-ecs";
import * as THREE from "three";
import { Scene } from "three";
import { Hardpoints } from "./components/aircraft/hardpoints.component";
import { Collider } from "./components/collider.component";
import { EventComponent } from "./components/event.component";
import { HUD } from "./components/aircraft/hud.component";

import { InputComponent as Input } from "./components/input.component";
import { Joystick } from "./components/aircraft/joystick.component";
import { MissileControl } from "./components/weapons/missile_control.component";
import { Box, FalconModel, SimpleModel } from "./components/model.component";
import { Airplane } from "./components/physics/airplane.component";
import { Missile } from "./components/physics/missile.component";
import { SpringODE } from "./components/physics/spring_ode.component";
import { TestComponent as Test } from "./components/test.component";
import { Velocity } from "./components/velocity.component";
import { ViewComponent as View } from "./components/view.component";
import { Afterburner } from "./components/particles/afterburner.component";

export class Assemblage {
	constructor(ecs, assets, scene) {
		this.ecs = ecs;
		this.assets = assets;
		this.scene = scene;
	}

	falcon(position, velocity) {
		const entity = new ECS.Entity(this.scene);
		entity.transform.position.copy(position);

		entity.addComponent(new Input(entity));
		entity.addComponent(new EventComponent(entity));
		entity.addComponent(new Airplane(entity, velocity));
		entity.addComponent(new Velocity(entity, velocity));
		entity.addComponent(new Joystick(entity));
		entity.addComponent(new HUD(entity));
		entity.addComponent(new Test(entity));
		entity.addComponent(new Afterburner(entity));
		entity.addComponent(new Collider(entity));
		entity.addComponent(new FalconModel(entity, this.assets.gltf.falcon.asset));
		entity.addComponent(new View(entity));

		let hardpoints = entity.addComponent(new Hardpoints(entity));
		hardpoints.h1.add(this.missile(entity.transform));
		hardpoints.h2.add(this.missile(entity.transform));
		hardpoints.h9.add(this.missile(entity.transform));
		hardpoints.h8.add(this.missile(entity.transform));

		this.ecs.addEntity(entity);
		return entity;
	}

	missile(parent) {
		const entity = new ECS.Entity(parent);
		entity.addComponent(new Input(entity));
		entity.addComponent(new MissileControl(entity));
		entity.addComponent(new SimpleModel(entity, this.assets.gltf.amraam.asset));
		this.ecs.addEntity(entity);
		return entity;
	}

	basic(position) {
		const entity = new ECS.Entity(this.scene);
		entity.transform.position.copy(position);
		entity.addComponent(new View(entity));
		entity.addComponent(new Collider(entity, new THREE.Vector3(10, 10, 10)));
		entity.addComponent(new Box(entity, { size: new THREE.Vector3(10, 10, 10) }));
		this.ecs.addEntity(entity);
		return entity;
	}
}
