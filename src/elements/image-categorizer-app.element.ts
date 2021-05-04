import {html, render, TemplateResult} from 'lit-html';
import {ImageInfo} from '../image-info';

class ImageCategorizerApp extends HTMLElement {
    private readonly renderRoot: ShadowRoot;

    protected connectedCallback() {
        this.setupData();
    }

    constructor() {
        super();
        this.renderRoot = this.attachShadow({mode: 'open'});
        document.addEventListener('keypress', (event: KeyboardEvent) => {
            if (this.imageData.length && this.currentIndex < this.imageData.length - 1) {
                this.categorizeImage(event.key);
            }
        });
    }

    private readonly styles: TemplateResult = html`
        <style>
            :host {
                font-family: sans-serif;
                text-align: center;
                display: flex;
                overflow: hidden;
                flex-direction: column;
                height: 100%;
                width: 100%;
                max-height: 100%;
                max-height: 100%;
                min-width: 100%;
                min-width: 100%;
            }

            .image-wrapper {
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
                flex-grow: 1;
                overflow: hidden;
            }
        </style>
    `;

    private currentIndex = 0;
    private categorized: Required<ImageInfo>[] = [];
    private imageData: ImageInfo[] = [];

    private createFullImagePath(imageName: string): string {
        return `/${imageName}`;
    }

    private async setupData(): Promise<void> {
        this.imageData = (await import('http://localhost:8000/image-data.json' as any)).default;
        // console.log(this.imageData);

        if (this.imageData.length >= 2) {
            this.loadImage(this.imageData[1]);
        }
        this.render();
    }

    private categorizeImage(category: string) {
        const currentImage = this.imageData[this.currentIndex];
        if (!currentImage) {
            throw new Error(
                `Index ${this.currentIndex} out of range. Image data length: ${this.imageData.length}`,
            );
        }
        this.categorized.push({...currentImage, category});
        ++this.currentIndex;
        const nextImageData = this.imageData[this.currentIndex];
        if (nextImageData) {
            this.loadImage(nextImageData);
        }
        console.log(JSON.stringify(this.categorized, null, 4));
        this.render();
    }

    private loadImage(info: ImageInfo) {
        // load the next image before we need it for fast loading
        // const nextImage = new Image();
        // nextImage.src = this.createFullImagePath(info.path);
    }

    private async render() {
        const currentImage = this.imageData[this.currentIndex];
        const imagePath = currentImage && this.createFullImagePath(currentImage.path);
        const sizeString = `${currentImage?.size.height}x${currentImage?.size.width}`;
        render(
            html`
                ${this.styles}
                ${currentImage
                    ? html`
                          <div class="size">HxW: ${sizeString}</div>
                          <div
                              class="image-wrapper"
                              style="background-image: url(${imagePath})"
                          ></div>
                      `
                    : `All images finished!`}
            `,
            this.renderRoot,
        );
    }
}

window.customElements.define('image-categorizer-app', ImageCategorizerApp);
