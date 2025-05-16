import frag from './shaders/fragmentShader.frag?raw'
import ExtendableShader from '~/webgl/Modules/Extendables/ExtendableShader/ExtendableShader'
import { Color } from 'three'

export type TShaderBackgroundColorOptions = {
	color?: Color
}

export class ShaderBackgroundColor extends ExtendableShader {
	// Private
	#color!: Color

	/**
	 * Constructor
	 * @param scene Scene
	 * @param options Options
	 */
	constructor(
		scene: ExtendableShader['scene'],
		options: TShaderBackgroundColorOptions
	) {
		super({ scene, frag })

		this.color = options.color ?? new Color(0, 0, 0)
	}

	/**
	 * Get the color
	 */
	public get color(): Color {
		return this.#color
	}

	/**
	 * Set the color
	 */
	public set color(value: Color) {
		this.#color = value

		this.setUniform('uColor', this.color)
	}
}
