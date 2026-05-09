// 网站全局配置文件
// 所有配置项均可自定义，无需修改核心逻辑代码
const SITE_CONFIG = {
    title: "引导页",// 网站标题（会显示在浏览器标签栏）
    favicon: "img/favicon.ico",// 网站ICO图标（填写完整URL，本地图标请用相对路径）
    backgroundImage: "https://t.alcy.cc/ycy", // 背景图URL（建议使用高清图）
    hefengWeatherAPIHost: "你的和风天气APIHOST", // 和风天气API地址（申请后替换）
    hefengWeatherKey: "你的和风天气KEY", // 和风天气KEY（需自行申请：https://dev.qweather.com/）
    searchEngine: "https://www.baidu.com/s?wd=", // 搜索引擎地址（拼接关键词后跳转）
    placeholderText: "输入点什么吧...", // 搜索框默认提示文字（自定义）
    // 导航按钮配置：数组形式，每个对象包含按钮文字和跳转链接
    navButtons: [
        { text: "Bilibili", url: "https://bilibili.com" },
        { text: "Blog", url: "https://four.pw" },
        { text: "Github", url: "https://github.com" },
        // 可新增按钮示例：
        // { text: "知乎", url: "https://zhihu.com" },
        // { text: "抖音", url: "https://douyin.com" }
    ],
    // 页脚自定义配置
    footer: {
        text: "©2026 ", // 页脚主文本（如版权信息）
        links: [ // 页脚链接列表（支持多个）
            { text: "樱花院|为了美好的世界", url: "https://https.cn/" },
            { text: "一言api", url: "https://hitokoto.cn/" },
            { text: "Github", url: "https://github.com/yingshen-hk" }
        ],
        fontSize: "10px", // 页脚字体大小
        color: "rgb(0, 0, 0)", // 页脚文字颜色
        linkColor: "rgb(0, 0, 0)" // 页脚链接颜色
    }
};