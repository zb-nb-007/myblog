// 存储文档数据
const API_BASE_URL = 'http://localhost:5000';

let documents = JSON.parse(localStorage.getItem('blog-documents')) || [];

// 存储工具数据
let tools = JSON.parse(localStorage.getItem('blog-tools')) || [
    {
        name: 'VS Code',
        icon: '💻',
        description: '强大的代码编辑器',
        url: 'https://code.visualstudio.com/'
    },
    {
        name: 'Git',
        icon: '🔄',
        description: '版本控制工具',
        url: 'https://git-scm.com/'
    },
    {
        name: 'Docker',
        icon: '🐳',
        description: '容器化平台',
        url: 'https://www.docker.com/'
    },
    {
        name: 'Postman',
        icon: '📮',
        description: 'API测试工具',
        url: 'https://www.postman.com/'
    },
    {
        name: 'Java',
        icon: '☕',
        description: '跨平台编程语言',
        url: 'https://www.java.com/'
    },
    {
        name: 'Python',
        icon: '🐍',
        description: '简洁易学的编程语言',
        url: 'https://www.python.org/'
    },
    {
        name: 'Shell',
        icon: '🖥️',
        description: '命令行脚本语言',
        url: 'https://www.gnu.org/software/bash/'
    },
    {
        name: 'Vue',
        icon: '🟢',
        description: '渐进式JavaScript框架',
        url: 'https://vuejs.org/'
    },
    {
        name: 'React',
        icon: '⚛️',
        description: '用于构建用户界面的库',
        url: 'https://reactjs.org/'
    },
    {
        name: 'Node.js',
        icon: '🟩',
        description: 'JavaScript运行环境',
        url: 'https://nodejs.org/'
    },
    {
        name: 'MongoDB',
        icon: '🍃',
        description: 'NoSQL数据库',
        url: 'https://www.mongodb.com/'
    },
    {
        name: 'MySQL',
        icon: '🐬',
        description: '关系型数据库',
        url: 'https://www.mysql.com/'
    },
    {
        name: 'Nginx',
        icon: '🟩',
        description: '高性能Web服务器',
        url: 'https://nginx.org/'
    },
    {
        name: 'Redis',
        icon: '🔴',
        description: '内存数据结构存储',
        url: 'https://redis.io/'
    },
    {
        name: 'TypeScript',
        icon: '🔷',
        description: 'JavaScript的超集',
        url: 'https://www.typescriptlang.org/'
    },
    {
        name: 'Kubernetes',
        icon: '☸️',
        description: '容器编排系统',
        url: 'https://kubernetes.io/'
    }
];

// 用户数据 (不再需要登录，直接使用默认值)
let user = {
    name: '技术爱好者',
    bio: '热爱编程和技术分享',
    avatar: './images/avatar.svg'
};

// DOM元素
const docList = document.getElementById('doc-list');
const toolsList = document.querySelector('.tools-list');
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page');
const addDocBtn = document.getElementById('add-doc-btn');
const docModal = document.getElementById('doc-modal');
const docTypeModal = document.getElementById('doc-type-modal');
const profileModal = document.getElementById('profile-modal');
const closeBtn = document.querySelector('.close-btn');
const closeProfileBtn = document.querySelector('.close-profile-btn');
const saveDocBtn = document.getElementById('save-doc-btn');
const saveProfileBtn = document.getElementById('save-profile-btn');
const docTitleInput = document.getElementById('doc-title');
const docContentInput = document.getElementById('doc-content');
const profileNameInput = document.getElementById('profile-name');
const profileBioInput = document.getElementById('profile-bio');
const profileAvatarInput = document.getElementById('profile-avatar');
const tagOptions = document.querySelectorAll('.tag-option');
const confirmTagBtn = document.getElementById('confirm-tag-btn');
const username = document.getElementById('username');
const userBio = document.getElementById('user-bio');
const avatarImg = document.getElementById('avatar-img');
const docCount = document.getElementById('doc-count');
const toolCount = document.getElementById('tool-count');
const editProfileBtn = document.getElementById('edit-profile-btn');

// 当前编辑的文档ID
let currentDocId = null;
let selectedTag = null;

// 从服务器获取文档数据
async function fetchDocuments() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/documents`);
        
        if (response.ok) {
            const data = await response.json();
            documents = data;
            localStorage.setItem('blog-documents', JSON.stringify(documents));
            renderDocuments();
            updateStats();
        }
    } catch (err) {
        console.error('获取文档失败:', err);
    }
}

// 从服务器获取工具数据
async function fetchTools() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tools`);
        
        if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
                tools = data;
                localStorage.setItem('blog-tools', JSON.stringify(tools));
                renderTools();
                updateStats();
            } else {
                // 如果服务器没有工具数据，则上传本地数据到服务器
                await uploadToolsToServer();
            }
        }
    } catch (err) {
        console.error('获取工具失败:', err);
    }
}

// 上传工具数据到服务器
async function uploadToolsToServer() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/tools/batch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tools)
        });
        
        if (response.ok) {
            console.log('工具数据已上传到服务器');
        }
    } catch (err) {
        console.error('上传工具数据失败:', err);
    }
}

// 初始化应用
async function initApp() {
    renderDocuments();
    renderTools();
    updateUserInfo();
    updateStats();
    
    // 从服务器获取数据
    await fetchDocuments();
    await fetchTools();
    
    // 设置默认页面
    showPage('tech-docs');
}

// 渲染文档列表
function renderDocuments() {
    docList.innerHTML = '';
    
    if (documents.length === 0) {
        docList.innerHTML = '<div class="empty-state">暂无文档，点击右下角按钮添加</div>';
        return;
    }
    
    documents.forEach(doc => {
        const docItem = document.createElement('div');
        docItem.className = 'doc-item';
        docItem.innerHTML = `
            <div class="doc-title">${doc.title}</div>
            <div class="doc-meta">
                <span class="doc-date">${formatDate(doc.createdAt)}</span>
                <span class="doc-tag">${doc.tag}</span>
            </div>
        `;
        
        docItem.addEventListener('click', () => {
            openDocModal(doc);
        });
        
        docList.appendChild(docItem);
    });
}

// 渲染工具列表
function renderTools() {
    toolsList.innerHTML = '';
    
    tools.forEach(tool => {
        const toolItem = document.createElement('div');
        toolItem.className = 'tool-item';
        toolItem.innerHTML = `
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-name">${tool.name}</div>
            <div class="tool-desc">${tool.description}</div>
        `;
        
        // 添加点击事件，跳转到官方链接
        toolItem.addEventListener('click', () => {
            if (tool.url) {
                window.open(tool.url, '_blank');
            }
        });
        
        toolsList.appendChild(toolItem);
    });
}

// 更新用户信息
function updateUserInfo() {
    username.textContent = user.name;
    userBio.textContent = user.bio;
    avatarImg.src = user.avatar;
}

// 更新统计数据
function updateStats() {
    docCount.textContent = documents.length;
    toolCount.textContent = tools.length;
}

// 格式化日期
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
}

// 显示指定页面
function showPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === pageId) {
            item.classList.add('active');
        }
    });
    
    document.getElementById(pageId).classList.add('active');
}

// 打开文档编辑弹窗
function openDocModal(doc = null) {
    if (doc) {
        currentDocId = doc.id;
        docTitleInput.value = doc.title;
        docContentInput.value = doc.content;
    } else {
        currentDocId = null;
        docTitleInput.value = '';
        docContentInput.value = '';
    }
    
    docModal.style.display = 'flex';
}

// 关闭文档编辑弹窗
function closeDocModal() {
    docModal.style.display = 'none';
}

// 打开文档类型选择弹窗
function openDocTypeModal() {
    docTypeModal.style.display = 'flex';
    
    // 重置选择
    tagOptions.forEach(option => {
        option.classList.remove('selected');
    });
    selectedTag = null;
}

// 关闭文档类型选择弹窗
function closeDocTypeModal() {
    docTypeModal.style.display = 'none';
}

// 打开个人资料编辑弹窗
function openProfileModal() {
    profileNameInput.value = user.name;
    profileBioInput.value = user.bio;
    profileAvatarInput.value = user.avatar === './images/avatar.svg' ? '' : user.avatar;
    profileModal.style.display = 'flex';
}

// 关闭个人资料编辑弹窗
function closeProfileModal() {
    profileModal.style.display = 'none';
}

// 保存个人资料
function saveProfile() {
    const name = profileNameInput.value.trim();
    const bio = profileBioInput.value.trim();
    let avatar = profileAvatarInput.value.trim();
    
    if (!name) {
        alert('请输入用户名');
        return;
    }
    
    // 如果头像URL为空，使用默认头像
    if (!avatar) {
        avatar = './images/avatar.svg';
    }
    
    // 更新用户数据
    user = {
        name,
        bio,
        avatar
    };
    
    // 保存到本地存储
    localStorage.setItem('blog-user', JSON.stringify(user));
    
    // 更新UI
    updateUserInfo();
    
    // 关闭弹窗
    closeProfileModal();
}

async function saveDocument() {
    const title = docTitleInput.value.trim();
    const content = docContentInput.value.trim();
    
    if (!title) {
        alert('请输入文档标题');
        return;
    }
    
    if (!content) {
        alert('请输入文档内容');
        return;
    }
    
    closeDocModal();
    openDocTypeModal();
}

// 确认文档类型并最终保存
async function confirmDocType() {
    if (!selectedTag) {
        alert('请选择一个文档类型');
        return;
    }
    
    const title = docTitleInput.value.trim();
    const content = docContentInput.value.trim();

    
    try {
        if (currentDocId) {
            // 更新现有文档
            const response = await fetch(`${API_BASE_URL}/api/documents/${currentDocId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, tag: selectedTag })
            });
            
            if (!response.ok) throw new Error('更新文档失败');
            
            // 更新本地数据
            const updatedDoc = await response.json();
            const index = documents.findIndex(doc => doc._id === currentDocId);
            if (index !== -1) {
                documents[index] = updatedDoc;
            }
        } else {
            // 创建新文档
            const response = await fetch(`${API_BASE_URL}/api/documents`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, tag: selectedTag })
            });
            
            if (!response.ok) throw new Error('创建文档失败');
            
            // 添加到本地数据
            const newDoc = await response.json();
            documents.unshift(newDoc);
        }
        
        // 保存到本地存储
        localStorage.setItem('blog-documents', JSON.stringify(documents));
        
        // 更新UI
        renderDocuments();
        updateStats();
        
        closeDocTypeModal();
    } catch (err) {
        console.error('保存文档错误:', err);
        alert('保存文档失败: ' + err.message);
    }
}

// 事件监听
navItems.forEach(item => {
    item.addEventListener('click', () => {
        const targetId = item.getAttribute('data-target');
        showPage(targetId);
    });
});

addDocBtn.addEventListener('click', () => {
    openDocModal();
});

closeBtn.addEventListener('click', () => {
    closeDocModal();
});

closeProfileBtn.addEventListener('click', () => {
    closeProfileModal();
});

saveDocBtn.addEventListener('click', saveDocument);

saveProfileBtn.addEventListener('click', saveProfile);

editProfileBtn.addEventListener('click', () => {
    openProfileModal();
});

tagOptions.forEach(option => {
    option.addEventListener('click', () => {
        tagOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedTag = option.getAttribute('data-tag');
    });
});

confirmTagBtn.addEventListener('click', confirmDocType);

// 初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 初始化本地存储
if (!localStorage.getItem('blog-documents')) {
    localStorage.setItem('blog-documents', JSON.stringify(documents));
}

if (!localStorage.getItem('blog-tools')) {
    localStorage.setItem('blog-tools', JSON.stringify(tools));
}