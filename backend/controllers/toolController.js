const Tool = require('../models/Tool');

// 获取所有工具
exports.getAllTools = async (req, res) => {
    try {
        const tools = await Tool.find().sort({ name: 1 });
        res.json(tools);
    } catch (err) {
        console.error('获取工具错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 创建工具
exports.createTool = async (req, res) => {
    try {
        const { name, icon, description, url } = req.body;
        
        if (!name || !icon || !description || !url) {
            return res.status(400).json({ message: '名称、图标、描述和URL都是必填项' });
        }
        
        // 检查工具是否已存在
        const existingTool = await Tool.findOne({ name });
        if (existingTool) {
            return res.status(400).json({ message: '该工具已存在' });
        }
        
        const newTool = new Tool({
            name,
            icon,
            description,
            url
        });
        
        const savedTool = await newTool.save();
        res.status(201).json(savedTool);
    } catch (err) {
        console.error('创建工具错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 批量创建工具
exports.batchCreateTools = async (req, res) => {
    try {
        const tools = req.body;
        
        if (!Array.isArray(tools) || tools.length === 0) {
            return res.status(400).json({ message: '请提供有效的工具数组' });
        }
        
        // 验证每个工具对象
        for (const tool of tools) {
            if (!tool.name || !tool.icon || !tool.description || !tool.url) {
                return res.status(400).json({ 
                    message: '每个工具都必须包含名称、图标、描述和URL',
                    invalidTool: tool
                });
            }
        }
        
        // 检查数据库中是否已存在这些工具
        const existingTools = await Tool.find({ name: { $in: tools.map(t => t.name) } });
        if (existingTools.length > 0) {
            const existingNames = existingTools.map(t => t.name);
            return res.status(400).json({ 
                message: '以下工具已存在',
                existingTools: existingNames
            });
        }
        
        const savedTools = await Tool.insertMany(tools);
        res.status(201).json(savedTools);
    } catch (err) {
        console.error('批量创建工具错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 更新工具
exports.updateTool = async (req, res) => {
    try {
        const { name, icon, description, url } = req.body;
        
        if (!name && !icon && !description && !url) {
            return res.status(400).json({ message: '至少需要提供一个更新字段' });
        }
        
        const tool = await Tool.findById(req.params.id);
        
        if (!tool) {
            return res.status(404).json({ message: '工具不存在' });
        }
        
        if (name) tool.name = name;
        if (icon) tool.icon = icon;
        if (description) tool.description = description;
        if (url) tool.url = url;
        
        const updatedTool = await tool.save();
        res.json(updatedTool);
    } catch (err) {
        console.error('更新工具错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};

// 删除工具
exports.deleteTool = async (req, res) => {
    try {
        const tool = await Tool.findByIdAndDelete(req.params.id);
        
        if (!tool) {
            return res.status(404).json({ message: '工具不存在' });
        }
        
        res.json({ message: '工具已删除' });
    } catch (err) {
        console.error('删除工具错误:', err);
        res.status(500).json({ message: '服务器错误' });
    }
};