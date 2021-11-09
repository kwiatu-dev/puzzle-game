class PuzzleGame {
	constructor(gameSetup) {
		this.display = document.querySelector(gameSetup.displaySelector);
		this.elementWidth = gameSetup.elementWidth;
		this.elementHeight = gameSetup.elementHeight;
		this.elementsCount = gameSetup.elementsCount;
		this.elementsX = gameSetup.elementsX;
		this.elementsY = gameSetup.elementsY;
		this.elements = null;
		this.imageNames = gameSetup.imageNames;
		this.imageTypes = gameSetup.imageTypes;
		this.blankElement = null;
		this.moves = 0;
		this.movesOutputSelector = document?.querySelector(gameSetup.movesOutputSelector);
	}

	getRandomElementIndexes = () => {
		let arr = [];
		let resoult = [];

		for (let i = 0; i < this.elementsCount; i++) {
			arr.push(i);
		}

		for (let i = 1; i <= this.elementsCount; i++) {
			const random = Math.floor(Math.random() * (this.elementsCount - i));
			resoult.push(arr[random]);
			arr[random] = arr[this.elementsCount - i];
		}

		return resoult;
	};

	setDisplaySize = () => {
		this.display.style.width = `${this.elementsX * this.elementWidth}px`;
		this.display.style.height = `${this.elementsY * this.elementHeight}px`;
	};

	createElement = (elementIndex, imgName, imgType) => {
		const div = document.createElement('div');
		div.setAttribute('data-element', `${elementIndex}`);
		div.classList.add('element');

		if (imgName && (!this.blankElement && elementIndex != this.elementsCount - 1)) {
			const img = document.createElement('img');
			img.src = `images\\${imgName}.${imgType}`;
			img.classList.add('picture');

			div.appendChild(img);
		}
		else{
			div.setAttribute('data-blank', 'blank');
			this.blankElement = div;
		}

		return div;
	};

	saveElements = () => {
		this.elements = this.display.querySelectorAll('.element');
	};

	isTangentElement = (elementIndex, blankIndex) =>{
		elementIndex++;
		blankIndex++;

		if(elementIndex - this.elementsX === blankIndex){
			return true;
		}
		else if(elementIndex + this.elementsX === blankIndex){
			return true;
		}
		else if(elementIndex - 1 === blankIndex && (elementIndex - 1) % this.elementsX !== 0){
			return true;
		}
		else if(elementIndex + 1 === blankIndex && elementIndex % this.elementsX !== 0){
			return true;
		}

		return false;
	}

	incrementMoves = () =>{
		this.movesOutputSelector.textContent = `Ilość ruchów: ${++this.moves}`;
	}

	swap = function (nodeA, nodeB) {
		const parentA = nodeA.parentNode;
		const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
	
		// Move `nodeA` to before the `nodeB`
		nodeB.parentNode.insertBefore(nodeA, nodeB);
	
		// Move `nodeB` to before the sibling of `nodeA`
		parentA.insertBefore(nodeB, siblingA);
	};

	checkIsArranged = () => {
		const currentElements = [...this.display.querySelectorAll('.element')];

		for(let i = 0; i < currentElements.length; i++){
			const elementAttribute = currentElements[i].getAttribute('data-element');

			if(elementAttribute != `${i}`){
				return false;
			}
		}

		return true;
	}

	selectElement = (e) => {
		const element = e.currentTarget;
		const elementIndex = element.getAttribute('data-index');
		const blankIndex = this.blankElement.getAttribute('data-index');

		//Check if blank element is sticky to clicked element
		if(this.isTangentElement(elementIndex, blankIndex)){
			this.swap(element, this.blankElement);
			element.setAttribute('data-index', blankIndex);
			this.blankElement.setAttribute('data-index', elementIndex);
			this.incrementMoves();

			//Check if picture is arranged when blankElement is on start position
			if(this.blankElement.getAttribute('data-index') === this.blankElement.getAttribute('data-element') && this.moves){
				if(this.checkIsArranged()){
					console.log('Ułożone');
				}
			}
		}
	};

	generateGrid = () => {
		this.setDisplaySize();

		for (let i = 0; i < this.elementsCount; i++) {
			const element = this.createElement(i, this.imageNames?.[i], this.imageTypes);
			this.display.appendChild(element);
		}

		this.saveElements();
	};

	makeRandom = () =>{
		const random = this.getRandomElementIndexes();
		this.display.innerHTML = '';
		
		random.forEach((item, index) => {
			const element = this.elements[item];
			element.addEventListener('click', this.selectElement);
			element.setAttribute('data-index', index);
			this.display.appendChild(element);
		});
	}
}

const gameSetup = {
	elementsCount: 16,
	elementsX: 4,
	elementsY: 4,
	elementWidth: 100,
	elementHeight: 100,
	displaySelector: '.game-display',
	//One from <elementCount> have to be nulled
	imageNames: [ '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '11x', '12x', '13x', '14x', '15x' ],
	imageTypes: 'jpg',
	movesOutputSelector: '.moves-count'
};

const game = new PuzzleGame(gameSetup);

const initGame = () => {
	game.generateGrid();
};


random = () => {
	game.makeRandom();
};