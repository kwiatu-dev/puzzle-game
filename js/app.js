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
		this.blankElements = [];
		this.blankIndexes = [];
		this.selectedElement = null;
		this.moves = 0;
		this.movesOutputSelector = document?.querySelector(gameSetup.movesOutputSelector);
	}

	/*
	 * getRandomElementIndexes - return Array with mixed indexes
	 * @return Array with numbers
	 */
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

	/*
	 * setDisplaySize - set size for display 
	 * @return 
	 */
	setDisplaySize = () => {
		this.display.style.width = `${this.elementsX * this.elementWidth}px`;
		this.display.style.height = `${this.elementsY * this.elementHeight}px`;
	};

	/*
	 * createElement - create elements with pictures inside and set them attributes and classes 
     * element without image name is added to <blankElements> Array as blank element
	 * 
	 * data-element is a attribute with start position number
	 * 
	 * elementNumber - position of element
	 * imgName - name of image
	 * imgType - type of image 
	 * 
	 * @return nodeElement(div > img)
	 */
	createElement = (elementNumber, imgName, imgType) => {
		const div = document.createElement('div');
		div.setAttribute('data-element', `${elementNumber}`);
		div.style.width = `${this.elementWidth}px`;
		div.style.height = `${this.elementHeight}px`;
		div.classList.add('element');

		if (imgName && (elementNumber !== this.elementsCount - 1 || this.blankElements.length != 0)) {
			const img = document.createElement('img');
			img.src = `images\\${imgName}.${imgType}`;
			img.classList.add('picture');

			div.appendChild(img);
		}
		else{
			div.setAttribute('data-blank', 'blank');
			div.classList.add('blank');
			this.blankElements.push(div);
		}

		return div;
	};

	/*
	 * saveElements - save all elements which was created as NodeList
	 * @return 
	 */
	saveElements = () => {
		this.elements = this.display.querySelectorAll('.element');
	};

	/*
	 * isInRow(selectedIndex, currentIndex) - check is elements are in the same row
	 *
	 * selectedIndex - index first element
	 * currentIndex - index secound element
	 * 
	 * @return boolean 
	 */
	isInRow = (selectedIndex, currentIndex) =>{
		if(Math.floor(selectedIndex / this.elementsX) === Math.floor(currentIndex / this.elementsX)){
			return true;
		}

		return false;
	}

	/*
	 * isTangentElement(selectedIndex, currentIndex) - check is elements are tangent
	 *
	 * selectedIndex - index first element
	 * currentIndex - index secound element
	 * 
	 * @return boolean 
	 */
	isTangentElement = (selectedIndex, currentIndex) =>{
		const movement = currentIndex - selectedIndex;

		//vertical
		if(movement % this.elementsX == 0){
			const moveSquares = movement < 0 ? (movement * -1) / 4 : movement / 4;
			const direction = movement < 0 ? -1 : 1;

			for(let i = 1; i <= moveSquares; i++){
				if(!this.blankIndexes.includes(selectedIndex + (i * this.elementsX * direction))){
					return false;
				}
			}

			return true;
		}
		//horizontally
		else if(movement < this.elementsX && this.isInRow(selectedIndex, currentIndex)){
			const moveSquares = movement < 0 ? movement * -1 : movement;
			const direction = movement < 0 ? -1 : 1;

			for(let i = 1; i <= moveSquares; i++){
				if(!this.blankIndexes.includes(selectedIndex + (i * direction))){
					return false;
				}
			}

			return true;
		}

		return false;
	}

	/*
	 * incrementMoves - increment moves 
	 * @return 
	 */
	incrementMoves = () =>{
		if(this.movesOutputSelector){
			this.movesOutputSelector.textContent = `Ilość ruchów: ${++this.moves}`;
		}
	}

	/*
	 * swap(nodeA, nodeB) - swap elements in DOM 
	 *
	 * nodeA - first element
	 * nodeB - second element
	 * 
	 * @return 
	 */
	swap = function (nodeA, nodeB) {
		const parentA = nodeA.parentNode;
		const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
	
		// Move `nodeA` to before the `nodeB`
		nodeB.parentNode.insertBefore(nodeA, nodeB);
	
		// Move `nodeB` to before the sibling of `nodeA`
		parentA.insertBefore(nodeB, siblingA);
	};

	/*
	 * checkIsArranged - check is picture arranged
	 * @return 
	 */
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

	/*
	 * checkIsBalnkElement(elementIndex) - check is element includes in blankIndexes Array
	 *
	 * elementIndex - index of element
	 * 
	 * @return boolean
	 */
	checkIsBalnkElement = (elementIndex) => {
		return this.blankIndexes.includes(elementIndex);
	}

	/*
	 * checkIsBlankElementsOnStartPosition - check are blank elements includes on start positions
	 * @return boolean
	 */
	checkIsBlankElementsOnStartPosition = () => {
		for(let item of this.blankElements){
			const data_element = item.getAttribute('data-element');
			const data_index = item.getAttribute('data-index');

			if(data_element != data_index){
				return false;
			}
		}

		return true;
	}

	/*
	 * selectElement(callback) - execute when element is clicked
	 * @return 
	 */
	selectElement = (e) => {
		const currentElement = e.currentTarget;
		const currentIndex = e.currentTarget.getAttribute('data-index') * 1;

		if(!this.selectedElement && !this.checkIsBalnkElement(currentIndex)){
			this.selectedElement = e.currentTarget;
			this.selectedElement.classList.add('selected');
		}
		else if(this.selectedElement && !this.checkIsBalnkElement(currentIndex)){
			this.selectedElement.classList.remove('selected');
			this.selectedElement = e.currentTarget;
			this.selectedElement.classList.add('selected');
		}
		else if(this.selectedElement && this.checkIsBalnkElement(currentIndex)){
			const selectedIndex = this.selectedElement.getAttribute('data-index') * 1;

			//Check if blank elements is sticky to clicked element
			if(this.isTangentElement(selectedIndex, currentIndex)){
				this.swap(this.selectedElement, currentElement);
				this.selectedElement.setAttribute('data-index', currentIndex);
				currentElement.setAttribute('data-index', selectedIndex);
				this.incrementMoves();
				this.selectedElement.classList.remove('selected');
				this.selectedElement = null;
				this.blankIndexes[this.blankIndexes.indexOf(currentIndex)] = selectedIndex;

				//Check if picture is arranged when blankElements is on start position
				if(this.checkIsBlankElementsOnStartPosition() && this.moves){
					if(this.checkIsArranged()){
						console.log('Ułożone');
					}
				}
			}
			else{
				//Element is not tangent
			}
		}
	};

	/*
	 * generateGrid - generate grid with all elements
	 * @return 
	 */
	generateGrid = () => {
		this.setDisplaySize();

		for (let i = 0; i < this.elementsCount; i++) {
			const element = this.createElement(i, this.imageNames?.[i], this.imageTypes);
			this.display.appendChild(element);
		}

		this.saveElements();
	};

	/*
	 * makeRandom - mixed all elements in grid
	 * @return 
	 */
	makeRandom = () =>{
		const random = this.getRandomElementIndexes();
		this.display.innerHTML = '';
		this.blankIndexes = [];
		this.moves = 0;
		
		random.forEach((item, index) => {
			const element = this.elements[item];
			element.addEventListener('click', this.selectElement);
			element.setAttribute('data-index', index);

			if(element.getAttribute('data-blank')){
				this.blankIndexes.push(index);
			}

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
	imageNames: [ '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x', '11x', '12x', '13x', '14x', '15x', '16x' ],
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