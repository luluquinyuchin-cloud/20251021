//reference[function lines's formula and code]:uila(@muilavalium) https://twitter.com/muilavalium/status/1407907000575565825
//reference [resize]: Bárbara Almeida https://openprocessing.org/crayon/9/1
const palettes = [
	['#413e4a', '#73626e', '#b38184', '#f0b49e', '#f7e4be'],
	['#e8ddcb', '#cdb380', '#036564', '#033649', '#031634'],
	['#223843', '#e9dbce', '#eff1f3', '#dbd3d8', '#d8b4a0', '#d77a61'],
	['#e29578', '#ffffff', '#006d77', '#83c5be', '#ffddd2', '#edf6f9'],
	['#594f4f', '#547980', '#45ada8', '#9de0ad', '#e5fcc2'],
	['#333333', '#8bc9c3', '#ffae43', '#ea432c', '#228345', '#d1d7d3', '#524e9c', '#9dc35e', '#f0a1a1'],
	['#e3cd98', '#c37c2b', '#f6ecce', '#333333', '#386a7a']
];
let a, d, x, y, h, s;
let t = 0.0;
let vel = 0.02;
let bg;
let palette_selected;
let pg, cc;

/** OPC START **/
let seed, formation, colors, fluctuation, star_shape, star_size, ghosts;
if (typeof OPC !== 'undefined') {
    OPC.slider('seed', ~~(Math.random() * 1000), 0, 1000);
    OPC.slider('formation', ~~(Math.random() * (4-1)+1), 1, 3, 1);
    OPC.slider('colors', ~~(Math.random() * palettes.length), 0, palettes.length-1, 1);
    OPC.slider('fluctuation', ~~(Math.random() * 5), 0, 5,1);
    OPC.slider('star_shape', (Math.random().toFixed(2)), 0, 1, 0.01);
    OPC.slider('star_size', ~~(Math.random()*(10-(-10)+(-10))), -10, 10, 0.1);
    OPC.slider('ghosts', (Math.random().toFixed(1)), 0, 1, 0.1);
} else {
    // 后备默认值（可根据需要调整）
    seed = ~~(Math.random() * 1000);
    formation = Math.floor(Math.random() * 3) + 1; // 1..3
    colors = Math.floor(Math.random() * palettes.length);
    fluctuation = Math.floor(Math.random() * 6); // 0..5
    star_shape = parseFloat(Math.random().toFixed(2));
    star_size = (Math.random() * 20) - 10; // -10..10
    ghosts = parseFloat(Math.random().toFixed(1)); // 0.0..1.0
}
/** OPC END **/

function setup() {
	createCanvas(windowWidth, windowHeight);
	pg = createGraphics(width, height)
	pg.fill(220, 80);
	pg.noStroke();
	bg = min(windowWidth*0.8, windowHeight*0.8)
	let bgStarNum = bg * 2
	let bgStarSize = bg * 0.001;
	for (let i = 0; i < bgStarNum; i++) {
		pg.ellipse(random(width), random(height), random(1) < 0.95 ? random(bgStarSize, bgStarSize * 3) : random(bgStarSize * 6, bgStarSize * 8))
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	//reset();
}

function mouseClicked() {
	shuffle(palette_selected, true);
}

function draw() {
	randomSeed(seed);
	palette_selected = palettes[colors];
	background(palette_selected[0]);
	image(pg, 0, 0)
	noStroke();
 translate(width/2,height/2)
	if (formation == 1) {
		lines();
	} else if (formation == 2) {
		spiral();
	} else if (formation == 3) {
		tile();
	}
	t += vel;
}

function lines() {
	for (let j = -bg/2; j < bg/2; j += bg/4) {
		push();
		translate(-bg / 2-bg*0.1, j)
		let a = PI /12
		rotate(-a / 2);
		push();
    x = bg /4;
		y = x * tan(a / 2);
		h = sqrt(sq(x) + sq(y));
		s = (h + y) / (h - y);

		while (x < bg) {
			let colNum = int(random(1, palette_selected.length));
			cc = color(palette_selected[colNum]);
if (random(1) < ghosts) {
				ghost(x, y+bg*0.04, (1.5 * y),(1.5 * y)* 1.5, random(1) > 0.5 ? 1 : 2, a)
			} else {
				star(x, y+bg*0.04, (1.5 * y)*0.35, cc)
			}
			push();
		translate(bg * 0.15, bg*0.32)
			if (random(1) < ghosts) {
				ghost(bg-x, -y, (1.5 * y), (1.5 * y) * 1.5, random(1) > 0.5 ? 1 : 2, a)
			} else {
				star(bg-x, -y, (1.5 * y) * 0.35, cc)
			}
			pop();
			x = x * s;
			y = y * s;
		}
		pop();
		pop();
	}
}

function spiral() {
	push();
	let pos = createVector(0, 0)
	let step = 2 * PI * 0.08;
	let num2 = (TWO_PI * 10) + PI
	let radius = width * 0.02;
	let pnum = 1.1;
	for (let i = 0; i < num2; i += step) {
		let colNum = int(random(1, palette_selected.length));
		cc = color(palette_selected[colNum]);
		push();
		pos.x = radius * pow(pnum, i) * sin(i);
		pos.y = radius * pow(pnum, i) * cos(i)
		let d = abs(pow(pnum, i) * (bg * 0.018));
		let angle = pos.heading();

		translate(pos.x, pos.y);
		fill(255)
		if (random(1) < ghosts) {
			ghost(0, 0, d, d * 1.5, random(1) > 0.5 ? 1 : 2, angle * 2)
		} else {
			star(0, 0, d * 0.3, cc)
		}
		pop();
	}
	pop();
}

function tile() {
	let count = 6;
	let w =bg / count;
	for (var j = 0; j < count; j++) {
		for (var i = 0; i < count; i++) {
			let colNum = int(random(1, palette_selected.length));
			cc = color(palette_selected[colNum]);
			let x = -bg / 2 + i * w+ w / 2;
			let y = -bg / 2 + j * w+ w / 2;
			push();
			translate( x,  y )
			if (random(1) < ghosts) {
				ghost(0, 0, w, w * 1.5, random(1) > 0.5 ? 1 : 2, 0)
			} else {
				star(0, 0, w * 0.35, cc);
			}
			pop();

		}
	}
}

	function star(x, y, d, cc) {
    push();
    fill(cc);
    noStroke();
    push();
    translate(x, y)
    let points = int(random(3, 12))
    let angle = TAU / points;
    let rBase = d + (d*star_size)*0.1
    let xInit = -10;
    let yInit = -10
    let rDiv = width * 0.01;

    beginShape();
    // 修复：为每次迭代计算 radian，避免未初始化导致 NaN
    for (let i = 0; i < points + 3; i++) {
        let radian = i / points;
        let pN = noise(xInit + (rBase) * cos(TAU * radian) * 0.2, yInit + (rBase) * sin(TAU * radian) * 0.5, t*fluctuation);
        let pR = (rBase) + rDiv * noise(pN);
        let pX = xInit + pR * cos(TAU * radian);
        let pY = yInit + pR * sin(TAU * radian); 
        curveVertex(pX, pY); 
        pX = xInit + (pR * star_shape) * cos(TAU * radian + (angle * 0.5)); 
        pY = yInit + (pR * star_shape) * sin(TAU * radian + (angle * 0.5)); 
        curveVertex(pX, pY);
    }
    endShape(CLOSE);
    pop();
    pop();
	}

	function ghost(x, y, w, h, ran, a) {
		let size = 5;
		let hW = w / (size * 0.8);
		let hH = h / (size);
		let eyecol = color(100, 10, 10)
		let bodycol = ["#ffffff", "#fbfefb"];
		noStroke();
		push();
		translate(x , y - hH * 0.5);
		rotate(a / 2)
		push();
		//leg_shadow-----
		fill(100);
		beginShape();
		vertex(-hW * 0.95, 0);
		vertex(hW * 0.95, 0);
		for (let i = hW; i > -hW + 1; i -= 1) {
			let y = hH + hH / 10 * cos(radians(i / (hW / 500)) + t);
			vertex(i, y);
		}
		vertex(-hW, hH);
		endShape();

		//ghost_body-----
		fill(random(bodycol));
		beginShape();
		vertex(hW, 0);
		bezierVertex(hW * 1.1, -hH * 1.35, -hW * 1.1, -hH * 1.35, -hW, 0);
		vertex(-hW, hH);
		for (let i = -hW; i < hW + 1; i += 1) {
			let y = hH + hH / 10 * sin(radians(i / (hW / 500)) - t);
			vertex(i, y);
		}
		vertex(hW, 0);
		endShape();
		pop();
		//eye
		let rannum = random(1) > 0.5 ? 1 : 2
		if (ran == 1) {

			fill(eyecol);
			strokeCap(ROUND)
			if (rannum == 1) {
				ellipse(-hW / 2, -hH / 2, hW / 5);
				ellipse(hW / 5, -hH / 2, hW / 5);
			} else {
				ellipse(hW / 2, -hH / 2, hW / 5);
				ellipse(-hW / 5, -hH / 2, hW / 5);
			}

		} else {
			stroke(eyecol);
			strokeWeight(hW / 10)
			noFill();
			if (rannum == 1) {
				arc(-hW / 2, -hH / 2, hW / 5, hW / 5, TWO_PI, PI);
				arc(hW / 5, -hH / 2, hW / 5, hW / 5, TWO_PI, PI);
			} else {
				arc(hW / 2, -hH / 2, hW / 5, hW / 5, TWO_PI, PI);
				arc(-hW / 5, -hH / 2, hW / 5, hW / 5, TWO_PI, PI);
			}
		}
		pop();
	}





  
document.addEventListener('DOMContentLoaded', function() {
    const threshold = 100; // 顯示選單的距離閾值 (100 像素)
    const menuWidth = 100; // 選單寬度
    
    // 定義選單項目內容及對應的連結
    const menuItems = [
        { name: '作品一', url: 'https://luluquinyuchin-cloud.github.io/20251014_1/' }, // 保持作品一連結
        { name: '作品二', url: 'https://hackmd.io/@tVINjW-9Sh-zy8GAA_LLcg/HJBgKd12xg' }, // 設定作品二連結
        { name: '作品三', url: '#' } // 保持作品三連結為 #
    ];

    // --- 1. 動態創建選單結構 ---
    
    let menuContainer = document.getElementById('menu-container');
    if (!menuContainer) {
        menuContainer = document.createElement('div');
        menuContainer.id = 'menu-container';
        document.body.appendChild(menuContainer);
    }
    
    // 創建顯眼的 MENU 標籤 (作為選單的標頭/按鈕)
    const menuLabel = document.createElement('div');
    menuLabel.id = 'menu-label';
    menuLabel.textContent = 'MENU';
    menuContainer.appendChild(menuLabel);

    // 創建子選單列表
    const menuList = document.createElement('ul');
    menuList.id = 'main-menu';
    menuContainer.appendChild(menuList);
    
    // 創建選單連結
    menuItems.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.textContent = item.name; 
        link.href = item.url; // 設定連結
        
        listItem.appendChild(link);
        menuList.appendChild(listItem);
    });

    // --- 2. 應用所有 CSS 樣式 (模擬 CSS 檔案) ---

    // 容器樣式 (實現全高、滑出和隱藏)
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '0';
    menuContainer.style.left = '0';
    menuContainer.style.width = `${menuWidth}px`;
    menuContainer.style.height = '100vh'; // 全螢幕高度
    menuContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 白色，透明度 50%
    menuContainer.style.zIndex = '1000';
    menuContainer.style.boxShadow = '2px 0 5px rgba(0, 0, 0, 0.2)';
    
    // 初始隱藏狀態：使用 transform 移出畫面
    menuContainer.style.transform = `translateX(-${menuWidth}px)`; 
    menuContainer.style.transition = 'transform 0.3s ease-out'; // 滑動動畫
    
    // --- MENU 標籤樣式 (放大加粗) ---
    menuLabel.style.textAlign = 'center';
    menuLabel.style.padding = '10px 0';
    menuLabel.style.backgroundColor = '#333'; 
    menuLabel.style.color = 'white';
    menuLabel.style.fontSize = '24px'; // 放大
    menuLabel.style.fontWeight = 'bold'; // 加粗
    menuLabel.style.cursor = 'default';

    // 子選單列表樣式 
    menuList.style.listStyleType = 'none';
    menuList.style.padding = '10px 0'; 
    menuList.style.margin = '0';
    
    // 子選單項目樣式和 hover 效果
    menuContainer.querySelectorAll('li a').forEach(link => {
        link.style.display = 'block';
        link.style.padding = '15px 10px';
        link.style.textDecoration = 'none';
        link.style.color = 'black'; // 子選單文字顏色黑色
        link.style.fontSize = '20px'; // 文字大小 20px
        link.style.transition = 'color 0.2s';
        
        // 鼠標靠近子選單顯示紅色文字的交互邏輯
        link.addEventListener('mouseenter', function() {
            this.style.color = 'red';
        });
        link.addEventListener('mouseleave', function() {
            this.style.color = 'black';
        });
    });

    // --- 3. 獲取選單的靜態尺寸 ---
    
    const initialRect = {
        left: 0, 
        top: 0, 
        width: menuWidth,
        height: window.innerHeight 
    };
    
    // 4. 定義顯示/隱藏選單的函數
    const showMenu = () => {
        menuContainer.style.transform = 'translateX(0)';
    };
    
    const hideMenu = () => {
        menuContainer.style.transform = `translateX(-${menuWidth}px)`;
    };

    // --- 5. 鼠標移動監聽邏輯 ---
    document.addEventListener('mousemove', function(event) {
        
        initialRect.height = window.innerHeight; // 更新高度

        const rectX = initialRect.left;
        const rectY = initialRect.top;
        const rectWidth = initialRect.width;
        const rectHeight = initialRect.height;
        
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        
        // 點到矩形的最短距離計算
        let closestX = Math.max(rectX, Math.min(mouseX, rectX + rectWidth));
        let closestY = Math.max(rectY, Math.min(mouseY, rectY + rectHeight));
        
        const distanceX = mouseX - closestX;
        const distanceY = mouseY - closestY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        // 判斷邏輯
        if (distance <= threshold) {
            showMenu();
        } else {
            hideMenu();
        }
    });
});