const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, 'Frontend/public')));
app.use(express.json());

// Complete SEO analysis endpoint
app.post('/analyze', (req, res) => {
    const { text } = req.body;
    
    // Analysis logic
    const keywords = [
        "content marketing",
        "SEO optimization", 
        "digital strategy",
        "online visibility",
        "search rankings",
        "keyword research"
    ];
    
    const seoTips = [
        "Consider adding more transition words to improve readability",
        "Add internal links to boost SEO",
        "Include relevant keywords naturally in your content",
        "Make sure your content answers user questions"
    ];
    
    const words = text ? text.split(/\s+/).filter(word => word.length > 0) : [];
    const sentences = text ? text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0) : [];
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    
    let readabilityScore = 'Good';
    let readabilityLevel = 'Grade 8 level';
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    
    if (wordCount < 50) {
        readabilityScore = 'Too Short';
        readabilityLevel = 'Add more content';
    } else if (avgWordsPerSentence > 20) {
        readabilityScore = 'Needs Improvement';
        readabilityLevel = 'Grade 12+ level';
    } else if (avgWordsPerSentence > 15) {
        readabilityScore = 'Fair';
        readabilityLevel = 'Grade 10 level';
    } else if (avgWordsPerSentence < 10) {
        readabilityScore = 'Excellent';
        readabilityLevel = 'Grade 6 level';
    }

    res.json({
        keywords,
        seoTips,
        wordCount,
        sentenceCount,
        readingTime: readingTime + ' min',
        readabilityScore,
        readabilityLevel
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
