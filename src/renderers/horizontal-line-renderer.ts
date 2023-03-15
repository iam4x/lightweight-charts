import { BitmapCoordinatesRenderingScope } from 'fancy-canvas';

import { HoveredObject } from '../model/chart-model';
import { Coordinate } from '../model/coordinate';

import { BitmapCoordinatesPaneRenderer } from './bitmap-coordinates-pane-renderer';
import { drawHorizontalLine, LineStyle, LineWidth, setLineStyle } from './draw-line';

export interface HorizontalLineRendererData {
	color: string;
	lineStyle: LineStyle;
	lineWidth: LineWidth;

	y: Coordinate;
	visible?: boolean;
	width: number;

	textA?: string;
	textB?: string;
	textC?: string;
	externalId?: string;
}

const enum Constants { HitTestThreshold = 7, }

export class HorizontalLineRenderer extends BitmapCoordinatesPaneRenderer {
	private _data: HorizontalLineRendererData | null = null;

	public setData(data: HorizontalLineRendererData): void {
		this._data = data;
	}

	public hitTest(x: Coordinate, y: Coordinate): HoveredObject | null {
		if (!this._data?.visible) {
			return null;
		}

		const { y: itemY, lineWidth, externalId } = this._data;
		// add a fixed area threshold around line (Y + width) for hit test
		if (y >= itemY - lineWidth - Constants.HitTestThreshold && y <= itemY + lineWidth + Constants.HitTestThreshold) {
			return {
				hitTestData: this._data,
				externalId: externalId,
			};
		}

		return null;
	}

	protected _drawImpl({ context: ctx, bitmapSize, horizontalPixelRatio, verticalPixelRatio }: BitmapCoordinatesRenderingScope): void {
		if (this._data === null) {
			return;
		}

		if (this._data.visible === false) {
			return;
		}

		const y = Math.round(this._data.y * verticalPixelRatio);
		if (y < 0 || y > bitmapSize.height) {
			return;
		}

		ctx.lineCap = 'butt';
		ctx.strokeStyle = this._data.color;
		ctx.lineWidth = Math.floor(this._data.lineWidth * horizontalPixelRatio);
		setLineStyle(ctx, this._data.lineStyle);
		drawHorizontalLine(ctx, y, 0, bitmapSize.width);

		if (this._data.textA || this._data.textB || this._data.textC) {
			setLineStyle(ctx, LineStyle.Solid);

			const rectHeight = 20;
			const rectX = 150;
			const rectY = y - 12.5;

			const textA = this._data.textA || '';

			const { width: textWidth } = ctx.measureText(textA);
			const rectW = textWidth + 20;

			ctx.beginPath();
			ctx.strokeStyle = this._data.color;
			ctx.fillStyle = '#FFF';
			ctx.rect(rectX, rectY, rectW, rectHeight);
			ctx.stroke();
			ctx.fill();

			ctx.beginPath();
			ctx.font = 'bold 9px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = this._data.color;
			ctx.fillText(textA, rectX + (rectW / 2), rectY + (rectHeight / 2));

			const textB = this._data.textB || '';

			const rect2X = rectX + rectW;
			const { width: textWidth2 } = ctx.measureText(textB);
			const rect2W = textWidth2 + 20;

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
				const rect3W = textWidth3 + 20;

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
