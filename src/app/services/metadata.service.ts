import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { getDOM } from '@angular/platform-browser/src/dom/dom_adapter';


@Injectable()
export class MetadataService {

	private titleService: Title;
	private headElement: HTMLElement;
	private metaDescription: HTMLElement;
	private metaTitle: HTMLElement;
	private DOM: any;

	
	constructor(titleService: Title) {
		this.titleService = titleService;
		this.DOM = getDOM();
		this.headElement = this.DOM.query('head');
	}

	public getTitle(): string {
		return this.titleService.getTitle();
	}

	public setTitle(title: string) {
		this.titleService.setTitle(title);
		this.setMetadata('name', 'title', title);
	}

	public getMetaDescription(): string {
		return this.getMetadata('name', 'description');
	}

	public setMetaDescription(description: string) {
		this.setMetadata('name', 'description', description);
	}



	public setMetadata(tag: string, name: string, valueContent:string) {
		let el: HTMLElement;
		el = this.DOM.query("meta[" + tag + "='" + name + "']");
		if (el === null) {
			el = this.DOM.createElement('meta');
			el.setAttribute(tag, name);
			this.headElement.appendChild(el);
		}
		el.setAttribute('content', valueContent);
	}


	public getMetadata(tag: string, name: string):string {
		let el: HTMLElement;
		el = this.DOM.query("meta[" + tag + "='" + name + "']");
		if (el === null) {
			el = this.DOM.createElement('meta');
			el.setAttribute(tag, name);
			this.headElement.appendChild(el);
		}
		return el.getAttribute('content');
	}

}