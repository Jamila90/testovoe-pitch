const formWrapper = document.querySelector(".form__total-wrap");

// Инициализируем слайдер
new Swiper(".swiper", {
	// Настройки
	spaceBetween: 0,
	loop: false,
	speed: 800,
	// Если нам нужна пагинация
	pagination: {
		el: ".swiper__pagination",

		// Фракция
		type: "custom",

		renderCustom: function (swiper, current, total) {
			return `<span class="swiper__pagination-current">0${current}</span> — <span class="swiper__pagination-total">0${total}</span>`;
		},
	},

	// Стрелки навигации
	navigation: {
		nextEl: ".swiper__button-next",
		prevEl: ".swiper__button-prev",
	},
});

const changeAmount = target => {
	const container = target.parentElement.parentElement.parentElement;
	const input = container.querySelector("input");
	const cost = container.querySelector(".total__num");
	const btnMinus = container.querySelector(".total__btn-minus");
	const iconDisabled = container.querySelector(".total__svg");
	const value = input.value;
	const costMultiplication = parseInt(cost.textContent, 10) * 2;
	const costDivision = parseInt(cost.textContent, 10) / 2;
	let count;

	if (target.classList.contains("total__btn-minus")) {
		count = parseInt(value, 10) - 1;
		count = count < 1 ? 1 : count;
		input.value = `${count}`;
		cost.textContent = `${costDivision}`;
	}

	if (target.classList.contains("total__btn-plus")) {
		count = parseInt(value, 10) + 1;
		count = count > 1 ? count : 1;
		input.value = `${count}`;
		cost.textContent = `${costMultiplication}`;
	}

	if (count === 1) {
		btnMinus.setAttribute("disabled", "disabled");
		iconDisabled.style.fill = "rgba(213, 213, 213, 1)";
	} else {
		btnMinus.removeAttribute("disabled");
		iconDisabled.style.fill = "rgba(33, 33, 33, 1)";
	}
};

formWrapper.addEventListener("click", function (e) {
	e.preventDefault();
	const target = e.target;

	if (target.classList.contains("total__btn-change-count")) {
		console.log('sdasdasdasd')
		changeAmount(target);
	}
});

$(document).ready(function () {
	$(".delivery-details__btn").click(function () {
		$(this)
			.parents(".delivery-details")
			.first()
			.find(".delivery-details__content-descr")
			.slideToggle("delivery-details__content-descr--show");
		$(this).toggleClass("delivery-details__btn--minus").siblings(".delivery-details__btn--minus");
	});
});
