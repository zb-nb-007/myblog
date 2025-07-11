const Document = require('../models/Document');

// 获取所有文档
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await Document.find().sort({ createdAt: -1 });
        res.json(documents);
    } catch (err) {
        console.error('获取文档错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 获取单个文档
exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: '文档不存在' });
        }
        
        res.json(document);
    } catch (err) {
        console.error('获取文档错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 创建文档
exports.createDocument = async (req, res) => {
    try {
        const { title, content, tag } = req.body;
        
        if (!title || !content || !tag) {
            return res.status(400).json({ message: '标题、内容和标签都是必填项' });
        }
        
        const newDocument = new Document({
            title,
            content,
            tag
        });
        
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (err) {
        console.error('创建文档错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新文档
exports.updateDocument = async (req, res) => {
    try {
        const { title, content, tag } = req.body;
        
        if (!title && !content && !tag) {
            return res.status(400).json({ message: '至少需要提供一个更新字段' });
        }
        
        const document = await Document.findById(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: '文档不存在' });
        }
        
        if (title) document.title = title;
        if (content) document.content = content;
        if (tag) document.tag = tag;
        
        const updatedDocument = await document.save();
        res.json(updatedDocument);
    } catch (err) {
        console.error('更新文档错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除文档
exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findByIdAndDelete(req.params.id);
        
        if (!document) {
            return res.status(404).json({ message: '文档不存在' });
        }
        
        res.json({ message: '文档已删除' });
    } catch (err) {
        console.error('删除文档错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};