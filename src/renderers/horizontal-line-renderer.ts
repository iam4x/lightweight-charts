import { Coordinate } from '../model/coordinate';

import { drawHorizontalLine, LineStyle, LineWidth, setLineStyle } from './draw-line';
import { IPaneRenderer } from './ipane-renderer';

export interface HorizontalLineRendererData {
	color: string;
	height: number;
	lineStyle: LineStyle;
	lineWidth: LineWidth;

	y: Coordinate;
	visible?: boolean;
	width: number;

	textA?: string;
	textB?: string;
	textC?: string;
}

export class HorizontalLineRenderer implements IPaneRenderer {
	private _data: HorizontalLineRendererData | null = null;

	public setData(data: HorizontalLineRendererData): void {
		this._data = data;
	}

	public draw(ctx: CanvasRenderingContext2D, pixelRatio: number, isHovered: boolean, hitTestData?: unknown): void {
		if (this._data === null) {
			return;
		}

		if (this._data.visible === false) {
			return;
		}

		const y = Math.round(this._data.y * pixelRatio);

		if (y < 0 || y > Math.ceil(this._data.height * pixelRatio)) {
			return;
		}

		const width = Math.ceil(this._data.width * pixelRatio);
		ctx.lineCap = 'butt';
		ctx.strokeStyle = this._data.color;
		ctx.lineWidth = Math.floor(this._data.lineWidth * pixelRatio);
		setLineStyle(ctx, this._data.lineStyle);
		drawHorizontalLine(ctx, y, 0, width);

		if (this._data.textA || this._data.textB || this._data.textC) {
			setLineStyle(ctx, LineStyle.Solid);

			const rectHeight = 20 * pixelRatio;
			const rectX = 150;
			const rectY = (y - 12.5);

			const textA = this._data.textA || '';

			const { width: textWidth } = ctx.measureText(textA);
			const rectW = (textWidth + 20) * pixelRatio;

			ctx.beginPath();
			ctx.strokeStyle = this._data.color;
			ctx.fillStyle = '#FFF';
			ctx.rect(rectX, rectY, rectW, rectHeight);
			ctx.stroke();
			ctx.fill();

			ctx.beginPath();
			ctx.font = `bold ${9 * pixelRatio}px Arial`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = this._data.color;
			ctx.fillText(textA, rectX + (rectW / 2), rectY + (rectHeight / 2));

			const textB = this._data.textB || '';

			const rect2X = rectX + rectW;
			const { width: textWidth2 } = ctx.measureText(textB);
			const rect2W = (textWidth2 + 20) * pixelRatio;

			ctx.beginPath();
			ctx.fillStyle = this._data.color;
			ctx.rect(rect2X, rectY, rect2W, rectHeight);
			ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.fillStyle = '#FFF';
			ctx.fillText(textB, rect2X + (rect2W / 2), rectY + (rectHeight / 2));

			if (this._data.textC) {
				const textC = this._data.textC || '';

				const rect3X = rect2X + rect2W;
				const { width: textWidth3 } = ctx.measureText(textC);
				const rect3W = (textWidth3 + 20) * pixelRatio;

				ctx.beginPath();
				ctx.fillStyle = '#FFF';
				ctx.rect(rect3X, rectY, rect3W, rectHeight);
				ctx.fill();
				ctx.stroke();

				ctx.beginPath();
				ctx.fillStyle = this._data.color;
				ctx.fillText(textC, rect3X + (rect3W / 2), rectY + (rectHeight / 2));
			}
		}
	}
}
