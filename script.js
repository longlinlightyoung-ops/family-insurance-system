// 数据存储和初始化
let familyMembers = [
    { id: 1, name: '张三', relation: 'self', gender: 'male', birthdate: '1985-05-15', phone: '13800138000', policies: 4 },
    { id: 2, name: '李四', relation: 'spouse', gender: 'female', birthdate: '1988-08-20', phone: '13900139000', policies: 3 },
    { id: 3, name: '张小明', relation: 'child', gender: 'male', birthdate: '2015-03-10', phone: '', policies: 2 },
    { id: 4, name: '张父', relation: 'parent', gender: 'male', birthdate: '1955-11-05', phone: '13700137000', policies: 2 }
];

let policies = [
    { id: 1, name: '终身寿险', memberId: 1, memberName: '张三', company: '中国人寿', type: 'life', annualPremium: 12000, frequency: 'yearly', startDate: '2020-01-01', endDate: '2040-01-01', nextPayment: '2024-01-01', status: 'active', policyNumber: 'CL-2020-001' },
    { id: 2, name: '重疾保险', memberId: 1, memberName: '张三', company: '平安保险', type: 'health', annualPremium: 6500, frequency: 'yearly', startDate: '2021-03-15', endDate: '2031-03-15', nextPayment: '2024-03-15', status: 'active', policyNumber: 'PA-2021-045' },
    { id: 3, name: '医疗保险', memberId: 2, memberName: '李四', company: '太平洋保险', type: 'health', annualPremium: 4200, frequency: 'semi-annual', startDate: '2022-06-01', endDate: '2023-12-01', nextPayment: '2023-12-01', status: 'active', policyNumber: 'TP-2022-123' },
    { id: 4, name: '家庭财产险', memberId: 1, memberName: '张三', company: '人保财险', type: 'property', annualPremium: 1800, frequency: 'yearly', startDate: '2022-10-10', endDate: '2023-10-10', nextPayment: '2023-10-10', status: 'expired', policyNumber: 'PICC-2022-567' },
    { id: 5, name: '儿童教育金', memberId: 3, memberName: '张小明', company: '泰康保险', type: 'life', annualPremium: 8000, frequency: 'yearly', startDate: '2020-09-01', endDate: '2035-09-01', nextPayment: '2024-09-01', status: 'active', policyNumber: 'TK-2020-789' },
    { id: 6, name: '意外伤害险', memberId: 4, memberName: '张父', company: '新华保险', type: 'accident', annualPremium: 1500, frequency: 'yearly', startDate: '2023-01-01', endDate: '2024-01-01', nextPayment: '2024-01-01', status: 'active', policyNumber: 'NCI-2023-012' }
];

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 设置当前日期
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('zh-CN', options);
    
    // 加载初始数据
    loadFamilyMembers();
    loadPolicies();
    loadDashboard();
    loadReminders();
    updateStats();
    
    // 设置导航菜单事件
    setupNavigation();
    
    // 设置模态框事件
    setupModals();
    
    // 初始化图表
    initCharts();
});

// 导航菜单切换
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-menu li');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有active类
            navItems.forEach(navItem => navItem.classList.remove('active'));
            // 添加当前active类
            this.classList.add('active');
            
            // 隐藏所有标签内容
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 显示选中的标签内容
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// 加载家庭成员
function loadFamilyMembers() {
    const membersContainer = document.getElementById('members-container');
    const familyList = document.getElementById('family-list');
    const policyMemberSelect = document.getElementById('policy-member');
    
    if (membersContainer) {
        membersContainer.innerHTML = '';
        
        familyMembers.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            
            // 根据性别选择头像颜色
            let avatarColor = member.gender === 'female' ? '#e84393' : '#3498db';
            
            // 根据关系选择图标
            let relationIcon = 'fa-user';
            if (member.relation === 'spouse') relationIcon = 'fa-heart';
            if (member.relation === 'child') relationIcon = 'fa-child';
            if (member.relation === 'parent') relationIcon = 'fa-user-tie';
            
            memberCard.innerHTML = `
                <div class="member-avatar" style="background-color: ${avatarColor};">
                    <i class="fas ${relationIcon}"></i>
                </div>
                <div class="member-info">
                    <h4>${member.name}</h4>
                    <p class="member-relation">${getRelationText(member.relation)}</p>
                    <p class="member-policies">${member.policies} 张保单</p>
                </div>
            `;
            
            membersContainer.appendChild(memberCard);
        });
    }
    
    // 更新家庭成员列表（仪表板）
    if (familyList) {
        familyList.innerHTML = '';
        
        // 只显示前4个成员
        const displayMembers = familyMembers.slice(0, 4);
        
        displayMembers.forEach(member => {
            const memberItem = document.createElement('div');
            memberItem.className = 'member-item';
            memberItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 0.8rem;">
                    <div style="width: 40px; height: 40px; border-radius: 50%; background-color: ${member.gender === 'female' ? '#e84393' : '#3498db'}; display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-user"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600;">${member.name}</div>
                        <div style="font-size: 0.8rem; color: #7f8c8d;">${getRelationText(member.relation)}</div>
                    </div>
                </div>
            `;
            familyList.appendChild(memberItem);
        });
    }
    
    // 更新保单表单中的成员选择
    if (policyMemberSelect) {
        policyMemberSelect.innerHTML = '';
        
        familyMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name + ' (' + getRelationText(member.relation) + ')';
            policyMemberSelect.appendChild(option);
        });
    }
}

// 获取关系文本
function getRelationText(relation) {
    const relations = {
        'self': '本人',
        'spouse': '配偶',
        'child': '子女',
        'parent': '父母',
        'sibling': '兄弟姐妹',
        'other': '其他'
    };
    return relations[relation] || relation;
}

// 获取保险类型文本
function getPolicyTypeText(type) {
    const types = {
        'health': '健康险',
        'life': '人寿险',
        'property': '财产险',
        'accident': '意外险',
        'travel': '旅行险',
        'other': '其他'
    };
    return types[type] || type;
}

// 加载保单
function loadPolicies() {
    const tableBody = document.getElementById('policies-table-body');
    const filter = document.getElementById('policy-filter') ? document.getElementById('policy-filter').value : 'all';
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    // 过滤保单
    let filteredPolicies = policies;
    if (filter !== 'all') {
        filteredPolicies = policies.filter(policy => {
            if (filter === 'active') return policy.status === 'active';
            if (filter === 'expired') return policy.status === 'expired';
            if (filter === 'health') return policy.type === 'health';
            if (filter === 'life') return policy.type === 'life';
            if (filter === 'property') return policy.type === 'property';
            return true;
        });
    }
    
    filteredPolicies.forEach(policy => {
        const row = document.createElement('tr');
        
        // 计算距离下次缴费的天数
        const nextPaymentDate = new Date(policy.nextPayment);
        const today = new Date();
        const daysUntilPayment = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
        
        // 计算距离到期日的天数
        const endDate = new Date(policy.endDate);
        const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        // 状态标签
        let statusClass = 'status-active';
        let statusText = '有效';
        
        if (policy.status === 'expired') {
            statusClass = 'status-expired';
            statusText = '已过期';
        } else if (daysUntilExpiry < 30) {
            statusText = '即将到期';
        } else if (daysUntilPayment < 7) {
            statusText = '即将缴费';
        }
        
        row.innerHTML = `
            <td>${policy.name}</td>
            <td>${policy.memberName}</td>
            <td>${policy.company}</td>
            <td>${getPolicyTypeText(policy.type)}</td>
            <td>¥${policy.annualPremium.toLocaleString()}</td>
            <td>${formatDate(policy.nextPayment)} ${daysUntilPayment <= 7 ? `<span style="color:#e74c3c; font-size:0.8rem;">(${daysUntilPayment}天后)</span>` : ''}</td>
            <td>${formatDate(policy.endDate)} ${daysUntilExpiry <= 30 ? `<span style="color:#f39c12; font-size:0.8rem;">(${daysUntilExpiry}天后)</span>` : ''}</td>
            <td class="${statusClass}">${statusText}</td>
            <td>
                <button class="btn-action" onclick="editPolicy(${policy.id})"><i class="fas fa-edit"></i></button>
                <button class="btn-action" onclick="deletePolicy(${policy.id})"><i class="fas fa-trash"></i></button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 更新最近添加的保单
    loadRecentPolicies();
    // 更新即将到期的保单
    loadUpcomingPolicies();
}

// 加载最近添加的保单
function loadRecentPolicies() {
    const recentContainer = document.getElementById('recent-policies');
    if (!recentContainer) return;
    
    recentContainer.innerHTML = '';
    
    // 按ID排序获取最近添加的保单（假设ID越大越新）
    const recentPolicies = [...policies].sort((a, b) => b.id - a.id).slice(0, 3);
    
    recentPolicies.forEach(policy => {
        const policyItem = document.createElement('div');
        policyItem.className = 'policy-item';
        policyItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div style="font-weight: 600;">${policy.name}</div>
                <div style="color: #3498db; font-weight: 600;">¥${policy.annualPremium.toLocaleString()}</div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #7f8c8d;">
                <div>${policy.memberName} · ${policy.company}</div>
                <div>${formatDate(policy.startDate)}</div>
            </div>
        `;
        recentContainer.appendChild(policyItem);
    });
}

// 加载即将到期的保单
function loadUpcomingPolicies() {
    const upcomingContainer = document.getElementById('upcoming-policies');
    if (!upcomingContainer) return;
    
    upcomingContainer.innerHTML = '';
    
    // 获取30天内到期的保单
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const upcomingPolicies = policies.filter(policy => {
        const endDate = new Date(policy.endDate);
        return endDate > today && endDate <= thirtyDaysFromNow && policy.status === 'active';
    }).sort((a, b) => new Date(a.endDate) - new Date(b.endDate)).slice(0, 3);
    
    if (upcomingPolicies.length === 0) {
        upcomingContainer.innerHTML = '<p style="color: #7f8c8d; text-align: center;">没有即将到期的保单</p>';
        return;
    }
    
    upcomingPolicies.forEach(policy => {
        const policyItem = document.createElement('div');
        policyItem.className = 'policy-item';
        
        const endDate = new Date(policy.endDate);
        const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
        
        policyItem.innerHTML = `
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <div style="font-weight: 600;">${policy.name}</div>
                <div style="color: #f39c12; font-weight: 600;">${daysUntilExpiry}天后</div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #7f8c8d;">
                <div>${policy.memberName} · ${policy.company}</div>
                <div>${formatDate(policy.endDate)}</div>
            </div>
        `;
        upcomingContainer.appendChild(policyItem);
    });
}

// 加载仪表板
function loadDashboard() {
    // 更新统计数据
    updateStats();
}

// 加载提醒
function loadReminders() {
    const paymentReminders = document.getElementById('payment-reminders');
    const expiryReminders = document.getElementById('expiry-reminders');
    
    if (!paymentReminders || !expiryReminders) return;
    
    paymentReminders.innerHTML = '';
    expiryReminders.innerHTML = '';
    
    const today = new Date();
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(today.getDate() + 7);
    
    // 缴费提醒
    const paymentDuePolicies = policies.filter(policy => {
        const nextPaymentDate = new Date(policy.nextPayment);
        return nextPaymentDate > today && nextPaymentDate <= sevenDaysFromNow && policy.status === 'active';
    }).sort((a, b) => new Date(a.nextPayment) - new Date(b.nextPayment));
    
    if (paymentDuePolicies.length === 0) {
        paymentReminders.innerHTML = '<div class="reminder-item"><div class="reminder-title">暂无即将缴费的保单</div></div>';
    } else {
        paymentDuePolicies.forEach(policy => {
            const nextPaymentDate = new Date(policy.nextPayment);
            const daysUntilPayment = Math.ceil((nextPaymentDate - today) / (1000 * 60 * 60 * 24));
            
            const reminder = document.createElement('div');
            reminder.className = 'reminder-item urgent';
            reminder.innerHTML = `
                <div class="reminder-title">${policy.name} - ${policy.memberName}</div>
                <div class="reminder-date">${daysUntilPayment}天后缴费 (${formatDate(policy.nextPayment)})</div>
                <div>金额: ¥${policy.annualPremium.toLocaleString()}</div>
            `;
            paymentReminders.appendChild(reminder);
        });
    }
    
    // 到期提醒
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringPolicies = policies.filter(policy => {
        const endDate = new Date(policy.endDate);
        return endDate > today && endDate <= thirtyDaysFromNow && policy.status === 'active';
    }).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
    if (expiringPolicies.length === 0) {
        expiryReminders.innerHTML = '<div class="reminder-item"><div class="reminder-title">暂无即将到期的保单</div></div>';
    } else {
        expiringPolicies.forEach(policy => {
            const endDate = new Date(policy.endDate);
            const daysUntilExpiry = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            
            const reminder = document.createElement('div');
            reminder.className = 'reminder-item warning';
            reminder.innerHTML = `
                <div class="reminder-title">${policy.name} - ${policy.memberName}</div>
                <div class="reminder-date">${daysUntilExpiry}天后到期 (${formatDate(policy.endDate)})</div>
                <div>保险公司: ${policy.company}</div>
            `;
            expiryReminders.appendChild(reminder);
        });
    }
    
    // 更新提醒计数
    const reminderCount = paymentDuePolicies.length + expiringPolicies.length;
    document.getElementById('reminder-count').textContent = reminderCount;
}

// 更新统计数据
function updateStats() {
    // 总保单数
    document.getElementById('total-policies').textContent = policies.length;
    
    // 本月应缴保费
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    
    const monthlyPremium = policies
        .filter(policy => {
            if (policy.status !== 'active') return false;
            
            const nextPaymentDate = new Date(policy.nextPayment);
            return nextPaymentDate.getMonth() + 1 === currentMonth;
        })
        .reduce((sum, policy) => {
            // 根据缴费频率计算本月应缴金额
            let monthlyAmount = policy.annualPremium;
            if (policy.frequency === 'semi-annual') monthlyAmount = policy.annualPremium / 2;
            if (policy.frequency === 'quarterly') monthlyAmount = policy.annualPremium / 4;
            if (policy.frequency === 'monthly') monthlyAmount = policy.annualPremium / 12;
            
            return sum + monthlyAmount;
        }, 0);
    
    document.getElementById('monthly-premium').textContent = '¥' + monthlyPremium.toLocaleString(undefined, { minimumFractionDigits: 0 });
    
    // 即将到期保单数
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    const expiringCount = policies.filter(policy => {
        if (policy.status !== 'active') return false;
        
        const endDate = new Date(policy.endDate);
        return endDate > today && endDate <= thirtyDaysFromNow;
    }).length;
    
    document.getElementById('expiring-count').textContent = expiringCount;
    
    // 更新保费总览页面
    updatePremiumSummary();
}

// 更新保费总览
function updatePremiumSummary() {
    // 年度总保费
    const annualTotal = policies
        .filter(policy => policy.status === 'active')
        .reduce((sum, policy) => sum + policy.annualPremium, 0);
    
    document.getElementById('annual-total').textContent = '¥' + annualTotal.toLocaleString();
    
    // 月均保费
    const monthlyAvg = annualTotal / 12;
    document.getElementById('monthly-avg').textContent = '¥' + monthlyAvg.toLocaleString(undefined, { minimumFractionDigits: 0 });
    
    // 最贵保单
    const mostExpensive = policies.reduce((max, policy) => 
        policy.annualPremium > max.annualPremium ? policy : max, policies[0]);
    
    document.getElementById('most-expensive').textContent = `${mostExpensive.name} - ¥${mostExpensive.annualPremium.toLocaleString()}`;
    
    // 保单类型数
    const policyTypes = [...new Set(policies.map(policy => policy.type))].length;
    document.getElementById('policy-types').textContent = policyTypes;
}

// 初始化图表
function initCharts() {
    // 年度保费图表
    const premiumCtx = document.getElementById('premiumChart');
    if (premiumCtx) {
        // 生成过去12个月的数据
        const monthlyData = [];
        const months = [];
        
        const today = new Date();
        for (let i = 11; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push(date.toLocaleDateString('zh-CN', { month: 'short' }));
            
            // 模拟每月保费数据
            const monthlyPremium = 4000 + Math.random() * 2000;
            monthlyData.push(monthlyPremium);
        }
        
        new Chart(premiumCtx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: '月度保费 (¥)',
                    data: monthlyData,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // 保单类型分布图表
    const typeCtx = document.getElementById('typeChart');
    if (typeCtx) {
        const typeCounts = {};
        policies.forEach(policy => {
            if (policy.status === 'active') {
                typeCounts[policy.type] = (typeCounts[policy.type] || 0) + 1;
            }
        });
        
        const typeLabels = Object.keys(typeCounts).map(getPolicyTypeText);
        const typeData = Object.values(typeCounts);
        const backgroundColors = ['#3498db', '#2ecc71', '#e74c3c', '#f39c12', '#9b59b6', '#1abc9c'];
        
        new Chart(typeCtx, {
            type: 'doughnut',
            data: {
                labels: typeLabels,
                datasets: [{
                    data: typeData,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // 按成员分布图表
    const memberCtx = document.getElementById('memberChart');
    if (memberCtx) {
        const memberPremium = {};
        policies.forEach(policy => {
            if (policy.status === 'active') {
                const memberName = policy.memberName;
                memberPremium[memberName] = (memberPremium[memberName] || 0) + policy.annualPremium;
            }
        });
        
        const memberLabels = Object.keys(memberPremium);
        const memberData = Object.values(memberPremium);
        const backgroundColors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
        
        new Chart(memberCtx, {
            type: 'bar',
            data: {
                labels: memberLabels,
                datasets: [{
                    label: '年度保费 (¥)',
                    data: memberData,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '¥' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
}

// 设置模态框
function setupModals() {
    // 添加保单按钮
    const addPolicyBtns = document.querySelectorAll('#add-policy-btn, #add-policy-btn2');
    const addPolicyModal = document.getElementById('add-policy-modal');
    
    addPolicyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addPolicyModal.classList.add('active');
        });
    });
    
    // 添加成员按钮
    const addMemberBtns = document.querySelectorAll('#add-member-btn, #add-member-btn2');
    const addMemberModal = document.getElementById('add-member-modal');
    
    addMemberBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            addMemberModal.classList.add('active');
        });
    });
    
    // 关闭模态框按钮
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const modals = document.querySelectorAll('.modal');
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modals.forEach(modal => modal.classList.remove('active'));
        });
    });
    
    // 点击模态框外部关闭
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // 保单表单提交
    const policyForm = document.getElementById('policy-form');
    if (policyForm) {
        policyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const newPolicy = {
                id: policies.length > 0 ? Math.max(...policies.map(p => p.id)) + 1 : 1,
                name: document.getElementById('policy-name').value,
                memberId: parseInt(document.getElementById('policy-member').value),
                memberName: familyMembers.find(m => m.id === parseInt(document.getElementById('policy-member').value)).name,
                company: document.getElementById('insurance-company').value,
                type: document.getElementById('policy-type').value,
                annualPremium: parseFloat(document.getElementById('annual-premium').value),
                frequency: document.getElementById('payment-frequency').value,
                startDate: document.getElementById('start-date').value,
                endDate: document.getElementById('end-date').value,
                nextPayment: document.getElementById('next-payment').value,
                status: document.getElementById('policy-status').value,
                policyNumber: document.getElementById('policy-number').value,
                notes: document.getElementById('policy-notes').value
            };
            
            // 添加到保单列表
            policies.push(newPolicy);
            
            // 更新成员保单计数
            const memberIndex = familyMembers.findIndex(m => m.id === newPolicy.memberId);
            if (memberIndex !== -1) {
                familyMembers[memberIndex].policies++;
            }
            
            // 重置表单
            policyForm.reset();
            
            // 关闭模态框
            addPolicyModal.classList.remove('active');
            
            // 重新加载数据
            loadFamilyMembers();
            loadPolicies();
            loadReminders();
            updateStats();
            
            // 显示成功消息
            alert('保单添加成功！');
        });
    }
    
    // 成员表单提交
    const memberForm = document.getElementById('member-form');
    if (memberForm) {
        memberForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const newMember = {
                id: familyMembers.length > 0 ? Math.max(...familyMembers.map(m => m.id)) + 1 : 1,
                name: document.getElementById('member-name').value,
                relation: document.getElementById('member-relation').value,
                gender: document.getElementById('member-gender').value,
                birthdate: document.getElementById('member-birthdate').value,
                phone: document.getElementById('member-phone').value,
                policies: 0,
                notes: document.getElementById('member-notes').value
            };
            
            // 添加到成员列表
            familyMembers.push(newMember);
            
            // 重置表单
            memberForm.reset();
            
            // 关闭模态框
            addMemberModal.classList.remove('active');
            
            // 重新加载数据
            loadFamilyMembers();
            
            // 显示成功消息
            alert('家庭成员添加成功！');
        });
    }
    
    // 保单过滤器
    const policyFilter = document.getElementById('policy-filter');
    if (policyFilter) {
        policyFilter.addEventListener('change', loadPolicies);
    }
}

// 编辑保单
function editPolicy(policyId) {
    const policy = policies.find(p => p.id === policyId);
    if (!policy) return;
    
    // 填充表单数据
    document.getElementById('policy-name').value = policy.name;
    document.getElementById('policy-member').value = policy.memberId;
    document.getElementById('insurance-company').value = policy.company;
    document.getElementById('policy-type').value = policy.type;
    document.getElementById('annual-premium').value = policy.annualPremium;
    document.getElementById('payment-frequency').value = policy.frequency;
    document.getElementById('start-date').value = policy.startDate;
    document.getElementById('end-date').value = policy.endDate;
    document.getElementById('next-payment').value = policy.nextPayment;
    document.getElementById('policy-status').value = policy.status;
    document.getElementById('policy-number').value = policy.policyNumber;
    document.getElementById('policy-notes').value = policy.notes || '';
    
    // 打开模态框
    document.getElementById('add-policy-modal').classList.add('active');
    
    // 暂时移除事件监听器，避免重复添加
    const policyForm = document.getElementById('policy-form');
    const oldSubmitHandler = policyForm.onsubmit;
    policyForm.onsubmit = null;
    
    // 添加新的提交处理程序
    policyForm.addEventListener('submit', function updatePolicy(e) {
        e.preventDefault();
        
        // 更新保单数据
        policy.name = document.getElementById('policy-name').value;
        policy.memberId = parseInt(document.getElementById('policy-member').value);
        policy.memberName = familyMembers.find(m => m.id === policy.memberId).name;
        policy.company = document.getElementById('insurance-company').value;
        policy.type = document.getElementById('policy-type').value;
        policy.annualPremium = parseFloat(document.getElementById('annual-premium').value);
        policy.frequency = document.getElementById('payment-frequency').value;
        policy.startDate = document.getElementById('start-date').value;
        policy.endDate = document.getElementById('end-date').value;
        policy.nextPayment = document.getElementById('next-payment').value;
        policy.status = document.getElementById('policy-status').value;
        policy.policyNumber = document.getElementById('policy-number').value;
        policy.notes = document.getElementById('policy-notes').value;
        
        // 重置表单
        policyForm.reset();
        
        // 关闭模态框
        document.getElementById('add-policy-modal').classList.remove('active');
        
        // 重新加载数据
        loadFamilyMembers();
        loadPolicies();
        loadReminders();
        updateStats();
        
        // 显示成功消息
        alert('保单更新成功！');
        
        // 移除事件监听器，恢复原始处理程序
        policyForm.removeEventListener('submit', updatePolicy);
        if (oldSubmitHandler) {
            policyForm.onsubmit = oldSubmitHandler;
        }
    }, { once: true });
}

// 删除保单
function deletePolicy(policyId) {
    if (!confirm('确定要删除此保单吗？此操作不可撤销。')) {
        return;
    }
    
    const policyIndex = policies.findIndex(p => p.id === policyId);
    if (policyIndex === -1) return;
    
    const policy = policies[policyIndex];
    
    // 减少成员保单计数
    const memberIndex = familyMembers.findIndex(m => m.id === policy.memberId);
    if (memberIndex !== -1 && familyMembers[memberIndex].policies > 0) {
        familyMembers[memberIndex].policies--;
    }
    
    // 删除保单
    policies.splice(policyIndex, 1);
    
    // 重新加载数据
    loadFamilyMembers();
    loadPolicies();
    loadReminders();
    updateStats();
    
    // 显示成功消息
    alert('保单删除成功！');
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN');
}