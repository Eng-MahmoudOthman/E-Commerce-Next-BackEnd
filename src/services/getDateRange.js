


export function getDateRange(startDateInput , endDateInput) {
	const format = (dateObj, isStart) => {
	const year = dateObj.getFullYear();
	const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
	const day = dateObj.getDate().toString().padStart(2, '0');
	const time = isStart ? 'T00:00:00.000Z' : 'T23:59:59.999Z';
	return new Date(`${year}-${month}-${day}${time}`).getTime();
	};

	let startDateObj , endDateObj;

	if (startDateInput && endDateInput) {
	startDateObj = new Date(startDateInput);
	endDateObj = new Date(endDateInput);
	} else if (startDateInput && !endDateInput) {
	startDateObj = new Date(startDateInput);
	endDateObj = new Date(); // النهاردة
	} else {
	startDateObj = new Date();
	endDateObj = new Date();
	}

	const start = format(startDateObj, true);
	const end = format(endDateObj, false);

	// رينج الشهر الحالي للتاريخ اللي بدأنا منه
	const year = startDateObj.getFullYear();
	const month = startDateObj.getMonth(); // 0-based
	const firstDayOfMonth = new Date(year, month , 1);
	const lastDayOfMonth = new Date(year, month + 1, 0); // اليوم الأخير في الشهر  لأن فى الجافا اسكريبت لما تحط اليوم صفر، بيرجعك لآخر يوم في الشهر اللي قبله. 
	const currentMonthRange = {
	start: format(firstDayOfMonth , true),
	end: format(lastDayOfMonth , false),
	};

	// رينج السنة الحالية للتاريخ اللي بدأنا منه
	const firstDayOfYear = new Date(year, 0, 1);
	const lastDayOfYear = new Date(year, 11, 31);
	const currentYearRange = {
	start: format(firstDayOfYear, true),
	end: format(lastDayOfYear, false),
	};

	return { start, end, currentMonth: currentMonthRange, currentYear: currentYearRange };
}




// دى بترجع  
// 1- بترجع من اول تاريخ بداية اليوم الى تانى تاريخ نهاية اليوم لو بعت تاريخين 
// 2- لو بعت تاريخ  واحد  معين بترجع من اول التاريخ دة بداية اليوم الى تاريخ النهاردة نهاية اليوم 
// 3- لو مبعتش تواريخ خالص هترجع اليوم الحالى من بدايتة لنهايتة  
// 4- بترجع رينج الشهر الحالى  من بداية اول يوم لنهاية اخر يوم
// 5-بيرجع من بداية اول يوم فى السنة لنهاية اخر يوم فى السنة نفس السنة 
// كل الراجع بيكوم مللى ثانية تقدر تستخدمة مباشرة فى الداتا بيز لو عامل فيلد فى مللى ثانية ودة  الاحسن


