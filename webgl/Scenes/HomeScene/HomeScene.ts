import { AmbientLight, Color, Light, Texture, Vector3 } from 'three'
import ExtendableScene from '../../Modules/Extendables/ExtendableScene'
import type { Dictionary } from '~/models/functions/dictionary.model'
import TransitionSlide from '~/webgl/Modules/Transitions/TransitionSlide/TransitionSlide'
import { ShaderHomeBackground } from '~/webgl/Modules/Shaders/ShaderHomeBackground/ShaderHomeBackground'
import SharedCube from '~/webgl/Items/SharedCube'

export default class HomeScene extends ExtendableScene<{
  shader: ShaderHomeBackground
}> {
  // Public

  /**
   * Constructor
   */
  constructor() {
    super()
    // Childs
    this.components = {
      cube: new SharedCube(),
    }

    // Transition
    this.transition = new TransitionSlide(this)

    // Init the scene
    this.on('load', () => this.#onLoad())
    this.on('scroll', (e) => this.#onScroll(e))
    this.on('update', () => this.#onUpdate())
  }

  // --------------------------------
  // Public
  // --------------------------------

  // --------------------------------
  // Events
  // --------------------------------

  /**
   * On load
   */
  #onLoad() {
    this.setupEnvironment(this.experience.resources.items.hdri as Texture, {
      background: false,
      environment: true,
    })
    this.#setupLights()

    // Camera
    this.camera.instance.position.z = 30

    // Shader
    this.shader = new ShaderHomeBackground(this, {
      color: new Color('#4b7cfb'),
      background: new Color('#f7fbff'),
    })
  }

  /**
   * On scroll
   */
  #onScroll(event: TScrollEvent) {
    // this.shader!.setUniform('tItem', this.activeItem?.contentTexture)
    // console.log(this.activeItem?.contentScene?.colors)
  }

  /**
   * On update
   */
  #onUpdate() {}

  // --------------------------------
  // Private methods
  // --------------------------------

  /**
   * Setup lights
   */
  #setupLights() {
    const lights: Dictionary<Light> = {}

    // Ambient light
    lights.ambient = new AmbientLight(0x00ff00, 1)
    this.scene.add(lights.ambient)
  }
}
