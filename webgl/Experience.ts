import Renderer from './Modules/Renderer/Renderer'
import Time from './Core/Time'
import Resources from './Core/Resources'
import SceneManager from './Core/SceneManager'
import CursorManager from '~/utils/CursorManager'
import { Raycaster } from 'three'
import AudioManager from './Core/AudioManager'
import Store from './Core/Store'
import KeysManager from '~/utils/KeysManager'
import Viewport from '~/utils/Viewport'
import Debug from './Core/Debug'

type TOptions = {
  name?: string
  defaultScene?: string
  canvas?: HTMLCanvasElement
  debug?: HTMLElement
}

export default class Experience {
  // Static
  static instance?: Experience
  static i18n: ReturnType<typeof useI18n>

  // Public
  public time!: Time
  public renderer!: Renderer
  public resources!: Resources
  public raycaster!: Raycaster
  public sceneManager!: SceneManager
  public keysManager!: KeysManager
  public audioManager!: AudioManager
  public cursorManager!: CursorManager
  public viewport!: Viewport
  public debug?: Debug
  public defaultScene?: string
  public debugContainer?: HTMLElement
  public canvas!: HTMLCanvasElement
  public name!: string
  public $bus!: any
  public store!: Store

  // Private
  #handleResize!: () => void
  #handleStart!: () => void
  #handleReady!: () => void
  #handleUpdate!: () => void

  /**
   * Constructor
   */
  constructor({ canvas, defaultScene, debug, name }: TOptions = {}) {
    // Singleton
    if (Experience.instance) {
      return Experience.instance
    }
    Experience.instance = this

    // Static
    if (!Experience.i18n) {
      Experience.i18n = useI18n() as unknown as ReturnType<typeof useI18n>
    }

    // Check if canvas
    if (!canvas) {
      throw new Error('No canvas provided')
    }

    // Public
    this.name = name || 'Experience'
    this.canvas = canvas
    this.debugContainer = debug
    this.defaultScene = defaultScene
    this.cursorManager = new CursorManager({
      el: this.canvas,
      enableBus: true,
    })
    this.store = new Store()
    this.active = false

    // Private
    this.#handleResize = this.#resize.bind(this)
    this.#handleStart = this.start.bind(this)
    this.#handleReady = this.#ready.bind(this)
    this.#handleUpdate = this.#update.bind(this)
    this.$bus = useNuxtApp().$bus

    // Init
    this.#init()
  }

  /**
   * Get active status
   */
  public get active() {
    return !!this.store.active
  }

  /**
   * Set active status
   */
  private set active(val: boolean) {
    this.store.active = val
  }

  /**
   * Start the experience
   */
  public start() {
    if (!this.resources.ready || this.active) return
    this.sceneManager.init(this.viewport?.debug ? this.defaultScene : undefined)
    this.active = true

    // Events
    this.time.on('tick', this.#handleUpdate)
  }

  /**
   * Dispose the experience
   */
  public dispose() {
    // Disposer dans l'ordre inverse de création
    this.viewport.dispose()
    this.time.dispose()
    this.cursorManager?.dispose()
    this.keysManager?.dispose()
    this.renderer.dispose()
    this.resources.dispose()
    this.sceneManager.dispose()
    this.audioManager.dispose()
    this.debug?.dispose()
    this.store?.dispose()
  }

  /**
   * Init the experience
   */
  #init() {
    // Set viewport and time
    this.viewport = new Viewport()
    this.time = new Time()

    // Init debug
    if (this.viewport.debug) {
      this.debug = new Debug()
    }

    // Set elements
    this.renderer = new Renderer({
      clearColor: {
        color: '#f7fbff',
        alpha: 0,
      },
    })
    this.resources = new Resources()
    this.keysManager = new KeysManager()
    this.sceneManager = new SceneManager()
    this.raycaster = new Raycaster()
    this.audioManager = new AudioManager()

    // Events
    this.resources.on('ready', this.#handleReady.bind(this))
    this.viewport.on('resize', this.#handleResize.bind(this))
  }

  /**
   * Handle ready
   */
  #ready() {
    if (!this.store.landing || this.active) this.#handleStart()
  }

  /**
   * Resize the experience
   */
  #resize() {
    this.renderer.resize()
    this.sceneManager.resize()
  }

  /**
   * Update the experience
   */
  #update() {
    this.renderer.update()
    this.sceneManager.update()
    this.#updateCursor()
    this.debug?.update()
  }

  /**
   * On mouse move
   */
  #updateCursor() {
    const list = this.sceneManager.renderList
    const cursors = [...new Set(list.map((scene) => scene.cursor))]
    const filteredCursors = cursors.filter((c) => c !== '')
    const value = filteredCursors?.slice(-1)?.[0] ?? ''

    if (value !== this.canvas.style.cursor) {
      this.canvas.style.cursor = value
    }
  }
}
