/**
 * 核心交互逻辑文件
 * 包含时钟、天气、搜索、导航、页脚渲染等核心功能实现
 */

// ========== 全局DOM元素获取 ==========
// 背景模糊层
const blurLayer = document.querySelector('.bg-blur');
// 时间容器（时钟外层）
const timeWrapper = document.getElementById('timeWrapper');
// 时钟主文本（时分秒）
const biaoti = document.getElementById('biaoti');
// 日期信息容器
const timeInfo = document.getElementById('timeInfo');
// 天气信息容器
const weatherInfo = document.getElementById('weatherInfo');
// 搜索框
const searchBox = document.getElementById('input_search');
// 导航按钮容器
const buttons = document.querySelector('.buttons');
// 一言标语容器
const slogan = document.querySelector('.slogan');
// 页脚容器
const footer = document.querySelector('.footer');
// 交互状态标识（是否处于激活态：时钟/搜索框点击后）
let isActive = false;

// ========== 搜索框特效 ==========
/**
 * 搜索框placeholder打字机特效
 * 从配置文件读取提示文字，逐字渲染到placeholder
 */
function typePlaceholder() {
    // 优先读取配置项，无配置则使用默认值
    const text = SITE_CONFIG.placeholderText || "输入点什么吧...";
    let index = 0;
    // 清空初始placeholder
    searchBox.placeholder = "";

    // 递归实现逐字打字
    function type() {
        if (index < text.length) {
            // 追加当前字符到placeholder
            searchBox.placeholder += text.charAt(index);
            index++;
            // 90ms延迟，模拟打字速度
            setTimeout(type, 90);
        }
    }
    // 启动打字特效
    type();
}

// ========== 导航按钮渲染 ==========
/**
 * 动态渲染导航按钮
 * 读取配置文件中的导航按钮列表，生成对应的按钮元素并绑定点击事件
 */
function renderNavButtons() {
    const buttonsContainer = document.querySelector('.buttons');
    // 清空原有按钮，避免重复渲染
    buttonsContainer.innerHTML = "";

    // 遍历配置的按钮列表，逐个生成按钮
    SITE_CONFIG.navButtons.forEach(btn => {
        const button = document.createElement('button');
        // 设置按钮样式类名
        button.className = 'button_daohang';
        // 设置按钮显示文字
        button.innerText = btn.text;
        // 绑定点击跳转事件
        button.onclick = () => openUrl(btn.url);
        // 将按钮添加到容器中
        buttonsContainer.appendChild(button);
    });
}

// ========== 页脚渲染 ==========
/**
 * 动态渲染页脚
 * 读取配置文件中的页脚配置，生成包含主文本和链接的页脚内容，并设置样式
 */
function renderFooter() {
    // 获取页脚配置项
    const footerConfig = SITE_CONFIG.footer;
    // 无配置则直接返回
    if (!footerConfig) return;

    // 清空原有页脚内容
    footer.innerHTML = "";
    // 设置页脚基础样式（字体大小、文字颜色）
    footer.style.fontSize = footerConfig.fontSize;
    footer.style.color = footerConfig.color;

    // 创建页脚主文本节点并添加
    const mainText = document.createTextNode(footerConfig.text);
    footer.appendChild(mainText);

    // 遍历页脚链接列表，逐个生成链接
    footerConfig.links.forEach(link => {
        // 添加分隔符（空格）
        footer.appendChild(document.createTextNode(" &nbsp"));
        // 创建a标签
        const aTag = document.createElement('a');
        // 设置链接地址
        aTag.href = link.url;
        // 新窗口打开
        aTag.target = "_blank";
        // 链接显示文字
        aTag.innerText = link.text;
        // 链接文字颜色
        aTag.style.color = footerConfig.linkColor;
        // 移除下划线
        aTag.style.textDecoration = "none";
        // 添加到页脚容器
        footer.appendChild(aTag);
    });
}

// ========== 时钟容器点击事件 ==========
/**
 * 时钟容器点击交互逻辑
 * 点击后切换激活态：显示完整日期/天气、背景模糊、隐藏其他元素
 */
timeWrapper.addEventListener('click', (e) => {
    // 阻止事件冒泡（避免触发document的点击重置事件）
    e.stopPropagation();

    // 如果已激活，点击则重置所有状态
    if(isActive){
        resetAll();
        return;
    }

    // 标记为激活态
    isActive = true;
    // 背景添加模糊效果
    blurLayer.style.backdropFilter = "blur(10px)";
    // 时钟容器添加激活样式
    timeWrapper.classList.add('active');
    // 隐藏搜索框、导航按钮、一言、页脚
    searchBox.style.opacity = "0";
    buttons.style.opacity = "0";
    slogan.style.opacity = "0";
    footer.style.opacity = "0";
    // 禁用所有交互元素
    disableAll(true);
    // 显示完整日期时间
    showFullDateTime();
    // 根据IP获取天气（使用ip.sb接口定位）
    getWeatherByIPSb();
});

// ========== 搜索框点击事件 ==========
/**
 * 搜索框点击交互逻辑
 * 点击后聚焦搜索，隐藏其他元素，背景模糊
 */
searchBox.addEventListener('click', (e) => {
    // 阻止事件冒泡
    e.stopPropagation();
    // 已激活则不处理
    if(isActive) return;

    // 标记为激活态
    isActive = true;
    // 背景添加模糊效果
    blurLayer.style.backdropFilter = "blur(10px)";
    // 隐藏时钟、导航按钮、一言、页脚
    timeWrapper.style.opacity = "0";
    buttons.style.opacity = "0";
    slogan.style.opacity = "0";
    footer.style.opacity = "0";
    // 禁用所有交互元素
    disableAll(true);
});

// ========== 全局点击重置事件 ==========
/**
 * 页面空白处点击事件
 * 点击后重置所有状态为默认
 */
document.addEventListener('click', () => {
    resetAll();
});

// ========== 日期时间显示 ==========
/**
 * 显示完整的日期时间（年/月/日/星期/节日）
 * 并渲染到timeInfo容器中
 */
function showFullDateTime() {
    const date = new Date();
    // 获取年、月（补零）、日（补零）
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    // 获取星期（中文）
    const week = "星期" + "日一二三四五六"[date.getDay()];
    
    // 节日判断（基础常用节日）
    let festival = "";
    if(month == "01" && day == "01") festival = "｜元旦";
    if(month == "02" && day == "10") festival = "｜春节";
    if(month == "05" && day == "01") festival = "｜劳动节";
    if(month == "10" && day == "01") festival = "｜国庆节";

    // 渲染完整日期信息
    timeInfo.innerText = `${year}年${month}月${day}日 ${week} ${festival}`;
}

// ========== 天气获取（核心） ==========
/**
 * 基于IP定位获取天气信息
 * 步骤：1. 通过ip.sb获取IP和城市 2. 调用和风天气API获取实时天气 3. 渲染到页面
 */
async function getWeatherByIPSb() {
    // 从配置文件读取和风天气密钥和API主机地址
    const HEFENG_KEY = SITE_CONFIG.hefengWeatherKey;
    const HEFENG_APIHOST = SITE_CONFIG.hefengWeatherAPIHost;

    try {
        // 加载中提示
        weatherInfo.innerText = "加载天气中...";

        // 1. 调用ip.sb接口获取IP和地理位置（无需密钥）
        const geoRes = await fetch("https://api.ip.sb/geoip/");
        const geoData = await geoRes.json();
        // 兜底IP（本地回环）
        const ip = geoData.ip || "127.0.0.1";

        // 2. 调用和风天气GeoAPI获取城市ID
        const locateRes = await fetch(`https://${HEFENG_APIHOST}/geo/v2/city/lookup?key=${HEFENG_KEY}&lang=zh&location=${ip}`);
        const locateData = await locateRes.json();
        // 获取城市ID和城市名称
        const cityId = locateData.location[0].id;
		const city = locateData.location[0].name;

        // 3. 调用和风天气实时天气API
        const weatherRes = await fetch(`https://${HEFENG_APIHOST}/v7/weather/now?location=${cityId}&key=${HEFENG_KEY}`);
        const weatherData = await weatherRes.json();
        // 获取温度和天气状况
        const temp = weatherData.now.temp;
        const weatherText = weatherData.now.text;

        // 4. 渲染天气信息到页面
        weatherInfo.innerText = `📍${city} ｜ ${temp}℃ ｜ ${weatherText}`;
    } catch (err) {
        // 异常处理：提示天气获取失败
        weatherInfo.innerText = "☁️ 天气获取失败";
        // 控制台打印错误，便于调试
        console.error("天气获取失败：", err);
    }
}

// ========== 状态重置 ==========
/**
 * 重置所有页面状态为默认
 * 恢复样式、显示隐藏元素、重置交互状态
 */
function resetAll() {
    // 非激活态则无需处理
    if (!isActive) return;
    // 重置激活状态标识
    isActive = false;

    // 移除背景模糊
    blurLayer.style.backdropFilter = "blur(0px)";
    // 移除时钟激活样式
    timeWrapper.classList.remove('active');
    // 恢复所有元素的显示
    timeWrapper.style.opacity = "1";
    searchBox.style.opacity = "1";
    buttons.style.opacity = "1";
    slogan.style.opacity = "1";
    footer.style.opacity = "1";
    // 清空天气信息
    weatherInfo.innerText = "";
    // 恢复所有交互元素
    disableAll(false);
}

// ========== 交互禁用/启用 ==========
/**
 * 禁用/启用页面交互元素
 * @param {boolean} disabled - true=禁用，false=启用
 */
function disableAll(disabled) {
    // 选择所有需要控制的交互元素（导航按钮、链接、一言、搜索框）
    document.querySelectorAll('.button_daohang, a, #slogan2, .search_input').forEach(el => {
        // pointer-events: none 禁用点击，auto 恢复
        el.style.pointerEvents = disabled ? "none" : "auto";
    });
}

// ========== 实时时钟 ==========
/**
 * 更新实时时钟（时分秒，补零）
 * 渲染到biaoti容器中
 */
function getTime() {
    const date = new Date();
    // 时、分、秒均补零（确保两位数）
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    // 渲染时钟
    biaoti.innerText = `${h}:${m}:${s}`;
}

// ========== 搜索功能 ==========
/**
 * 搜索框回车触发搜索
 * @param {Event} e - 键盘事件对象
 */
function search(e) {
    // 判断是否按下回车键（keyCode 13）
    if (e.keyCode === 13) {
        // 获取并去除搜索框首尾空格
        const kw = searchBox.value.trim();
        // 有搜索关键词则跳转搜索引擎
        if(kw) window.open(SITE_CONFIG.searchEngine + encodeURIComponent(kw));
        // 重置页面状态
        resetAll();
    }
}

// ========== 链接打开 ==========
/**
 * 打开指定URL（新窗口）
 * @param {string} url - 目标链接地址
 */
function openUrl(url) { 
    window.open(url); 
}

// ========== 一言加载 ==========
/**
 * 加载一言（随机文案）并实现打字机特效
 * 接口：https://v1.hitokoto.cn/，分类：a（动漫）
 */
async function loadYiYan() {
    const dom = document.getElementById("slogan2");
    // 清空原有内容
    dom.innerText = "";

    try {
        // 调用一言API（分类a：动漫）
        const res = await fetch("https://v1.hitokoto.cn/?c=a");
        const data = await res.json();
        // 拼接文案和来源
        const text = `${data.hitokoto} ——${data.from || '未知'}`;
        
        let index = 0;
        dom.innerText = "";
        // 打字机特效逐字渲染
        function type() {
            if (index < text.length) {
                dom.innerText += text.charAt(index);
                index++;
                setTimeout(type, 80);
            }
        }
        // 启动打字特效
        type();
    } catch (e) {
        // 异常处理：提示加载成功（兜底文案）
        dom.innerText = "加载成功";
        // 控制台打印错误
        console.error("一言加载失败：", e);
    }
}

// ========== 页面初始化 ==========
/**
 * 页面加载完成后初始化所有功能
 */
window.onload = () => {
    // 1. 动态设置背景图（从配置文件读取）
    document.querySelector('.bg').style.backgroundImage = `url(${SITE_CONFIG.backgroundImage})`;
    document.body.style.backgroundImage = `url(${SITE_CONFIG.backgroundImage})`;
    
    // 2. 启动时钟定时器（每秒刷新）
    setInterval(getTime, 1000);
    // 3. 初始化时钟显示
    getTime();
    // 4. 初始化搜索框placeholder打字特效
    typePlaceholder();
    // 5. 初始化导航按钮渲染
    renderNavButtons();
    // 6. 初始化页脚渲染
    renderFooter();
    // 7. 初始化一言加载
    loadYiYan();
};