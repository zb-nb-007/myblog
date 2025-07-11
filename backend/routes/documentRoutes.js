const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');

// 获取所有文档
router.get('/', documentController.getAllDocuments);

// 获取单个文档
router.get('/:id', documentController.getDocumentById);

// 创建文档
router.post('/', documentController.createDocument);

// 更新文档
router.put('/:id', documentController.updateDocument);

// 删除文档
router.delete('/:id', documentController.deleteDocument);

module.exports = router;