// State management for inserted keywords
let insertedKeywords = new Set();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const textInput = document.getElementById('textInput');

    // Add click event to analyze button
    analyzeBtn.addEventListener('click', function() {
        startAnalysis();
    });

    // Add keyboard shortcut (Ctrl+Enter or Cmd+Enter)
    textInput.addEventListener('keydown', function(event) {
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            event.preventDefault();
            startAnalysis();
        }
    });
});

// Show loading spinner and hide results
function showLoadingState() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingState = document.getElementById('loadingState');
    const resultsSection = document.getElementById('resultsSection');

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Analyzing...';
    loadingState.classList.remove('hidden');
    resultsSection.classList.add('hidden');
}

// Hide loading spinner
function hideLoadingState() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingState = document.getElementById('loadingState');

    analyzeBtn.disabled = false;
    analyzeBtn.textContent = 'Analyze SEO';
    loadingState.classList.add('hidden');
}

// Show results section
function showResults() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('hidden');
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Main analysis function: sends text to backend and updates UI
async function startAnalysis() {
    const textInput = document.getElementById('textInput');
    const text = textInput.value.trim();

    if (!text) {
        alert('Please enter some text to analyze');
        return;
    }

    showLoadingState();

    try {
        const response = await fetch('/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await response.json();
        hideLoadingState();
        showResults();

        // Update UI with backend data
        document.getElementById('wordCount').textContent = data.wordCount;
        document.getElementById('sentenceCount').textContent = data.sentenceCount;
        document.getElementById('readingTime').textContent = data.readingTime;
        document.getElementById('readabilityScore').textContent = data.readabilityScore;
        document.getElementById('readabilityLevel').textContent = data.readabilityLevel;

        // Set readability color
        const scoreColors = {
            'Excellent': '#4CAF50',
            'Good': '#8BC34A',
            'Fair': '#FF9800',
            'Needs Improvement': '#FF5722',
            'Too Short': '#9E9E9E'
        };
        document.getElementById('readabilityScore').style.color = scoreColors[data.readabilityScore] || '#4CAF50';

        // Display keywords and suggestions from backend
        displayKeywords(data.keywords);
        displaySuggestions(data.seoTips);
    } catch (error) {
        hideLoadingState();
        alert('Error analyzing text');
        console.error(error);
    }
}

// Display keyword suggestions from backend
function displayKeywords(keywords) {
    const keywordsListEl = document.getElementById('keywordsList');
    keywordsListEl.innerHTML = '';

    keywords.forEach(function(keyword) {
        const keywordItem = document.createElement('div');
        keywordItem.className = 'keyword-item';

        const isInserted = insertedKeywords.has(keyword);

        keywordItem.innerHTML =
            '<span class="keyword-text">' + keyword + '</span>' +
            '<button class="keyword-btn" onclick="insertKeyword(\'' + keyword + '\')" ' +
            (isInserted ? 'disabled' : '') + '>' +
            (isInserted ? 'Inserted' : 'Insert') +
            '</button>';

        if (isInserted) {
            keywordItem.classList.add('inserted');
        }

        keywordsListEl.appendChild(keywordItem);
    });
}

// Insert keyword into textarea and update UI
function insertKeyword(keyword) {
    if (insertedKeywords.has(keyword)) return;

    const textInput = document.getElementById('textInput');
    const currentText = textInput.value;

    // Simple insertion at the end of first sentence
    const sentences = currentText.split('.');
    if (sentences.length > 1) {
        sentences[0] = sentences[0] + ' ' + keyword;
        textInput.value = sentences.join('.');
    } else {
        textInput.value = currentText + ' This content focuses on ' + keyword + '.';
    }

    // Mark as inserted
    insertedKeywords.add(keyword);

    // Update keywords display
    // You must call displayKeywords with the latest keywords from the backend.
    // For simplicity, you can re-analyze (call startAnalysis) or keep a copy of the last keywords array.
    // Here, we re-analyze:
    startAnalysis();

    // Add visual feedback
    textInput.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
    setTimeout(function() {
        textInput.style.backgroundColor = '';
    }, 1000);
}

// Display SEO suggestions from backend
function displaySuggestions(seoTips) {
    const seoSuggestionsEl = document.getElementById('seoSuggestions');
    seoSuggestionsEl.innerHTML = '';

    seoTips.forEach(function(tip) {
        const listItem = document.createElement('li');
        listItem.textContent = tip;
        seoSuggestionsEl.appendChild(listItem);
    });
}
