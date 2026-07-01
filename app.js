// app.js

// DOM Element Declarations
const totalAreaInput = document.getElementById('totalArea');
const areaUnitInput = document.getElementById('areaUnit');
const targetNutrientInput = document.getElementById('targetNutrient');
const rateUnitInput = document.getElementById('rateUnit');
const targetRateInput = document.getElementById('targetRate');
const percentNInput = document.getElementById('percentN');
const percentPInput = document.getElementById('percentP');
const percentKInput = document.getElementById('percentK');
const swathWidthInput = document.getElementById('swathWidth');

const totalProductOut = document.getElementById('totalProductOut');
const productPer1000Out = document.getElementById('productPer1000Out'); 
const mathProcessLog = document.getElementById('mathProcessLog');       
const logAppBtn = document.getElementById('logAppBtn');
const historyList = document.getElementById('historyList');
const calibrationWrapper = document.getElementById('calibrationWrapper');

function calculateFertilizer() {
    // 1. Establish Area Foundations
    let inputAreaValue = parseFloat(totalAreaInput.value) || 0;
    let totalSqFt = inputAreaValue;
    let areaCalculationNote = `${inputAreaValue.toLocaleString()} sq ft`;
    
    if (areaUnitInput.value === 'acre') {
        totalSqFt = inputAreaValue * 43560; // 1 Acre = 43,560 Sq Ft
        areaCalculationNote = `${inputAreaValue} Acres × 43,560 = ${totalSqFt.toLocaleString()} sq ft`;
    }

    // 2. Extract Active Ingredient Fraction
    let selectedNutrientPercent = 0;
    const targetNutrient = targetNutrientInput.value;
    if (targetNutrient === 'N') selectedNutrientPercent = parseFloat(percentNInput.value) || 0;
    if (targetNutrient === 'P') selectedNutrientPercent = parseFloat(percentPInput.value) || 0;
    if (targetNutrient === 'K') selectedNutrientPercent = parseFloat(percentKInput.value) || 0;
    
    const nutrientDecimal = selectedNutrientPercent / 100;

    // 3. Establish Target Nutrient Delivery Base rate
    let inputRateValue = parseFloat(targetRateInput.value) || 0;
    let targetRatePer1000 = inputRateValue;
    let rateCalculationNote = `${inputRateValue} lbs of ${targetNutrient} per 1,000 sq ft`;
    
    if (rateUnitInput.value === 'perAcre') {
        targetRatePer1000 = inputRateValue / 43.56;
        rateCalculationNote = `${inputRateValue} lbs per Acre ÷ 43.56 = ${targetRatePer1000.toFixed(3)} lbs of ${targetNutrient} per 1,000 sq ft`;
    }

    // Fallback protection if inputs are blank or zero
    if (nutrientDecimal === 0 || totalSqFt === 0) {
        totalProductOut.textContent = "0.0";
        productPer1000Out.textContent = "0.0";
        mathProcessLog.innerHTML = '<div class="text-gray-400 italic">Awaiting valid entry values...</div>';
        calibrationWrapper.innerHTML = '';
        return;
    }

    // 4. Core Calculations
    const productPer1000 = targetRatePer1000 / nutrientDecimal;
    const totalProductNeeded = productPer1000 * (totalSqFt / 1000);

    // Render Large Screen Visuals
    totalProductOut.textContent = totalProductNeeded.toFixed(1);
    productPer1000Out.textContent = productPer1000.toFixed(2);

    // 5. Generate Clear Plain-Text Mathematical Explanations
    mathProcessLog.innerHTML = `
        <div><span class="text-blue-500">■</span> <strong>Step 1: Normalize Target Application Base Rate</strong></div>
        <div class="pl-3 text-gray-500 mb-2">${rateCalculationNote}</div>

        <div><span class="text-blue-500">■</span> <strong>Step 2: Determine Product Weight per 1,000 sq ft</strong></div>
        <div class="pl-3 text-gray-600 font-bold bg-gray-100 p-1 rounded my-1">
          Formula: Target Rate ÷ Nutrient Percentage = Weight<br>
          Math: ${targetRatePer1000.toFixed(2)} lbs ÷ ${nutrientDecimal} (${selectedNutrientPercent}%) = <span class="text-blue-700">${productPer1000.toFixed(2)} lbs of product</span>
        </div>
        <div class="pl-3 text-gray-400 italic mb-2">This is the physical weight of bag material required to hit your nutrient goal over a standard 1,000 sq ft pass.</div>

        <div><span class="text-blue-500">■</span> <strong>Step 3: Scale Across Treatment Footprint</strong></div>
        <div class="pl-3 text-gray-500">Total footprint area: ${areaCalculationNote}</div>
        <div class="pl-3 text-gray-600 font-bold bg-gray-100 p-1 rounded my-1">
          Math: ${productPer1000.toFixed(2)} lbs × (${totalSqFt.toLocaleString()} sq ft ÷ 1,000) = <span class="text-green-700">${totalProductNeeded.toFixed(1)} lbs total product</span>
        </div>
    `;

    // 6. Spreader Calibration Layout Rendering
    const swathWidth = parseFloat(swathWidthInput.value) || 10;
    const requiredRunLength = (1000 / swathWidth).toFixed(1);
    const targetTestWeightLbs = productPer1000.toFixed(2);
    const targetTestWeightOunces = (productPer1000 * 16).toFixed(1);

    calibrationWrapper.innerHTML = `
        <div class="bg-white p-6 rounded-lg shadow-md mb-12">
            <h3 class="text-lg font-bold text-gray-800 mb-2">SFMA Spreader Calibration Guide</h3>
            <p class="text-sm text-gray-600 mb-4">
                To calibrate your spreader for exactly <strong>${productPer1000.toFixed(1)} lbs</strong> of total product per 1,000 sq ft, execute this test course:
            </p>
            <ol class="list-decimal list-inside text-sm text-gray-700 space-y-2">
                <li>Because your spreader layout covers a <span class="font-bold text-blue-600">${swathWidth} ft</span> swath, measure out a path exactly <span class="font-bold text-green-700">${requiredRunLength} feet</span> long to test a 1,000 sq ft area.</li>
                <li>Fill your hopper half-full, and set the release gate dial to a low baseline manufacturer setting.</li>
                <li>Walk the course line at an even pace, opening the hopper path exactly at the start line and snapping it closed right at the finish line.</li>
                <li>Collect and weigh the output. Your target weight collection is exactly <span class="font-bold text-green-700">${targetTestWeightLbs} lbs</span> (${targetTestWeightOunces} oz).</li>
            </ol>
        </div>
    `;
}

// History Panel Rendering
function displayHistory() {
    let history = JSON.parse(localStorage.getItem('fertHistory')) || [];
    historyList.innerHTML = ''; 
    
    if (history.length === 0) {
        historyList.innerHTML = '<li class="py-2 text-sm text-gray-400 italic">No applications logged yet.</li>';
        return;
    }
    
    [...history].reverse().forEach(entry => {
        const li = document.createElement('li');
        li.className = 'py-2 flex justify-between text-sm text-gray-600';
        li.innerHTML = `
            <span><strong>${entry.date}</strong> - ${entry.area} (${entry.nutrient} target)</span>
            <span class="font-semibold text-green-700">${entry.totalWeight} lbs</span>
        `;
        historyList.appendChild(li);
    });
}

// Universal Listeners
[totalAreaInput, areaUnitInput, targetNutrientInput, rateUnitInput, targetRateInput, percentNInput, percentPInput, percentKInput, swathWidthInput].forEach(input => {
    input.addEventListener('input', calculateFertilizer);
});

logAppBtn.addEventListener('click', () => {
    let history = JSON.parse(localStorage.getItem('fertHistory')) || [];

    const newEntry = {
        date: new Date().toLocaleDateString(),
        area: `${totalAreaInput.value} ${areaUnitInput.value === 'acre' ? 'Acres' : 'sq ft'}`,
        nutrient: targetNutrientInput.value,
        totalWeight: totalProductOut.textContent
    };

    history.push(newEntry);
    localStorage.setItem('fertHistory', JSON.stringify(history));

    displayHistory();
});

// Startup Runs
calculateFertilizer();
displayHistory();