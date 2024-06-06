function makeBannerSwiper(slidePerView) {
    mySwiper = new Swiper(".mySwiper", {
        slidesPerView: slidePerView,
        spaceBetween: 24,
        centeredSlides: true,
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        loop: true,
        autoplay: {
            delay: 2000,
        },
    });
}

function makeWeeklyBestSwiper() {
    document.getElementById('weeklyBest').innerHTML = '';
    const prdList = getPrdList('weeklyBest.json');
    const prdGrpList = [];
    let grpIdx = 0;
    for(const [index, prd] of prdList.entries()) {
        if(index%prdCnt === 0) {
            grpIdx = index/prdCnt;
            prdGrpList[grpIdx] = [];
        }
        prdGrpList[grpIdx].push(prd)
    }

    for (const prdGrp of prdGrpList) {
        const div = document.createElement('div');
        const ul = document.createElement('ul');
        div.classList.add('swiper-slide');
        ul.classList.add('prd-list');
        ul.innerHTML = makePrdListHTML(prdGrp);
        div.appendChild(ul);
        document.getElementById('weeklyBest').append(div);
    }

    weeklyBestSwiper = new Swiper(".weeklyBestSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        autoplay: {
            delay: 3000,
        },
    });
}

function getPrdList(jsonLink) {
    let prdList = [];
    $.ajax({
        async: false,
        url: jsonLink,
        dataType: 'json',
        success: function(data) {
            prdList = data.products;
        }
    })
    return prdList;
}

function makePrdListHTML(list) {
    let html = '';
    for (const prd of list) {
        const colorList = prd.colors.reduce((acc, cur) => {
            return acc += `<span style="background-color: ${cur}"></span>`
        }, '');
        const iconList = prd.icons.reduce((acc, cur) => {
            return acc += `<span><img src="${cur}"></span>`
        }, '');
        let price = `<span class="sale-price">${prd.price}</span>`;
        if(prd.discount > 0) {
            price += `<span class="orig-price">${prd.price_default}</span>`;
            price += `<span class="disc-rate">${prd.discount}%</span>`;
        }

        const descHidden = !prd.description?'hidden':'';

        html += `
            <div class="prd-item">
                <a href="#">
                    <div class="prd-thumbnail"><img src="${prd.thumbnail}" alt="${prd.name}"></div>
                    <div class="prd-info">
        `
        html += `
                        <div class="prd-color">${colorList}</div>
                        <div class="prd-icon">${iconList}</div>
                        <div class="prd-name">${prd.name}</div>
                        <div class="prd-desc" ${descHidden}>${prd.description}</div>
                        <div class="prd-price">${price}</div>
                        <div class="prd-review">리뷰: ${prd.reviews_count}</div>
        `;
        html += `
                    </div>
                </a>
            </div>
        `;
    }
    return html;
};
