const express = require('express');
const router = express.Router();
const toolController = require('../controllers/toolController');

// 获取所有工具
router.get('/', toolController.getAllTools);

// 创建工具
router.post('/', toolController.createTool);

// 批量创建工具
router.post('/batch', toolController.batchCreateTools);

// 更新工具
router.put('/:id', toolController.updateTool);

// 删除工具
router.delete('/:id', toolController.deleteTool);

module.exports = router;