import { Color } from 'three'
import frag from './shaders/fragmentShader.frag?raw'
import ExtendableShader from '~/webgl/Modules/Extendables/ExtendableShader/ExtendableShader'
import gsap from 'gsap'

export class ShaderHomeBackground extends ExtendableShader {
  // Public
  public tl: gsap.core.Timeline

  /**
   * Constructor
   * @param scene Scene
   * @param options Options
   */
  constructor(
    scene: ExtendableShader['scene'],
    options?: { color?: Color; background?: Color }
  ) {
    super({ scene, frag })

    // Public
    this.tl = gsap.timeline()

    // Default uniforms
    this.setUniform('tItem', null)

    // Colors
    const color = options?.color ?? new Color(0, 0, 0)
    this.setUniform('uColor', color)

    // Background
    const background = options?.background ?? new Color(0, 0, 0)
    this.setUniform('uBackground', background)
  }
}
