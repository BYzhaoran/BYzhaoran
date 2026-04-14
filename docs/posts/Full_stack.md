# 全方位技术大纲

## 1. 数学与理论基础

先建立“够用的数学直觉”，不要一开始就陷入推公式焦虑。

- 线性代数：向量、矩阵、坐标变换（做视觉、控制都会遇到）
- 概率统计：均值方差、分布、噪声建模（做滤波和评估很关键）
- 最优化：梯度下降、损失函数（深度学习训练核心）
- 控制基础：PID、系统响应、稳定性（机器人控制必备）
- 状态估计：卡尔曼滤波、四元数（姿态和传感器融合常见）
- 强化学习基础：MDP、价值函数、策略梯度（先懂概念再上代码）

建议：数学阶段以“能解释 + 能应用”为主，先不追求全证明。

## 2. 编程基础

### part1 C/C++（嵌入式核心）

这部分跟着上课也能学个大概，也够用
但是如果后续有转码的打算，C/C++还是有很多地方值得专门研究的


这一部分主要是用于单片机的开发
比较常用的可能就是51（老资历，位居了），stm32系列 ，Ti系列（电赛保留节目） 
深入一点还有国产的优秀产品 ESP32 GD32系列，但都大同小异，触类旁通
绕来绕去，其实大多用的都是stm32，特别是当RM电控😇

后面发现，c语言确实是用的最多，但用途却不是最广（你Py大爷泛用性这一块没得说）
至少我除了单片机，其他方面确实没怎么用C

毋庸置疑的是C确实是语言基础，掌握之后熟悉其他语言还算是比较快（？）

### part2 Python（算法与实验）

python我们是没有专门的课程去学习的
但其实很多地方都可以用上，包括但不限于

视觉（CV处理 Yolo等模型），
深度学习、强化学习（）
各种自动化脚本
基于Linux的各种硬件驱动、Linux开发板的应用
Linux上基于各种物理模型的仿真驱动
...

Py经常被说简单，但各种开源代码架构里也没那么简单（）
要求倒也没那么高，能够读懂代码，并且能在AI辅助下进行开发即可

总之就是Py是一种应用上限极高的语言，也得益于其轻松的调库方式（import）

### Others

- Java、Node.js：可作为补充，主要用于服务端或工具链扩展

## 3. 软件基础

### 编程软件
毋庸置疑的真神 Vscode
嵌入式专用 Keil

Jetbrain系列：
C语言好手，嵌入式场景偶有奇效 Clion
Py常见工具 Pycharm

上述各有优劣，但Vscode一定没错😋

### 工具型软件

Git系列：Git 代码版本管理工具

这个就不多说了，谁用谁知道（
分支管理、多人协作、回滚救命，全靠它。

另外这几个也得会：
- 数据结构与算法（不一定卷竞赛，但至少写代码别太“玄学”）
- Linux 开发环境、Shell、Make/CMake（尤其做板子和部署，基本绕不开）
- Git 工程协作（commit 规范、分支策略、PR 流程）

## 4. 嵌入式系统核心

这一部分是“把算法落到硬件”的底座。

- MCU/SoC 架构：ARM Cortex-M/A、RISC-V
- 外设接口：GPIO、UART、SPI、I2C、CAN
- RTOS：FreeRTOS / Zephyr 的任务调度与中断
- Bootloader + OTA：设备可升级和可维护
- 资源优化：实时性、功耗、内存占用

新手目标：先让系统稳定跑起来，再做性能优化。

## 5. 电路与硬件设计

做嵌入式，硬件基础必须有，不然定位问题会很慢。

- 电路基础：模拟/数字电路、时序、采样
- 常见器件：运放、ADC/DAC、电源、传感器
- PCB 流程：原理图 -> 布局布线 -> 打样验证
- 调试工具：示波器、逻辑分析仪
- 工程意识：EMC/EMI、可靠性、可维护性

新手重点：先能看懂波形，能区分“软件问题”和“硬件问题”。

## 6. 深度学习（DL）

重点不是背模型，而是跑通完整流程。

- 框架：PyTorch（推荐主线）
- 任务：目标检测（如 Deformable DETR）
- 流程：数据清洗、标注、增强、训练、验证、评估
- 调优：学习率、损失函数、过拟合处理
- 部署：ONNX / TensorRT / TFLite

新手目标：先做一个可复现项目，再追求高指标。

## 7. 强化学习（RL）

强化学习和控制、仿真结合很紧密。

- 经典算法：DQN、PPO、SAC、TD3
- 关键能力：奖励设计、归一化、探索策略
- 常见方向：离线 RL、模仿学习、策略迁移
- 核心难点：Sim2Real（仿真到实机）

新手建议：先在仿真里稳定训练，再考虑上真实硬件。

## 8. 仿真与数字孪生

仿真是低成本试错和快速迭代的关键。

- 常用平台：MuJoCo、Isaac Sim、Gazebo
- 关键工作：动力学建模、噪声建模、域随机化
- 验证流程：HIL / SIL / MIL
- 工程要求：实验可复现、参数可记录、结果可对比

目标：减少“仿真很好，实机不行”的落差。

## 9. 感知-决策-执行闭环（具身智能主线）

完整系统一般由三层组成：

- 感知层：视觉、语音、IMU 等输入
- 决策层：规划、策略、任务分解
- 执行层：电机控制、底层控制器（PID/MPC）

配套能力：

- 状态估计与融合
- 通信链路与时序管理
- 软硬件联合调试

目标：让系统不只是“单模块能跑”，而是“全链路稳定”。

## 10. 方向总结（成为怎样的开发者）

目标画像：

AI + 嵌入式系统开发者，专注具身智能方向；掌握 STM32/RTOS 与电机控制，具备机器人运动规划与控制能力；熟悉 PyTorch 与目标检测（Deformable DETR），具备数据处理与模型训练经验；使用 MuJoCo / Isaac Sim / Gazebo 进行仿真与强化学习探索；具备从感知（视觉/语音）到决策再到执行的完整系统开发能力，能够实现软硬件一体化的智能系统。

通俗一点：
不只会写模型，也不只会做单片机驱动，
而是能把算法、控制、硬件和工程流程完整串起来。

另外在工程落地里，软件和工具链同样重要：

- 嵌入式开发：[STM32CubeMX](https://www.st.com/en/development-tools/stm32cubemx.html)（工程生成）、[Keil MDK](https://www.keil.com/)（编译调试）、DMTools（串口/协议联调）、[FreeMASTER](https://www.nxp.com/design/design-center/software/development-software/freemaster-run-time-debugging-tool:FREEMASTER)（参数观测）、[VOFA+](https://www.vofa.plus/)（实时波形）
- AI/数据与实验：[Anaconda](https://www.anaconda.com/docs/getting-started/anaconda/main)（环境管理）、[Jupyter](https://jupyter.org/documentation)（实验记录）、[MATLAB](https://www.mathworks.com/help/matlab/)（控制建模）
- 仿真平台：[Isaac Sim](https://docs.isaacsim.omniverse.nvidia.com/latest/index.html)（高保真仿真）、[MuJoCo](https://mujoco.readthedocs.io/en/stable/)（RL 高频场景）、[Gazebo](https://gazebosim.org/docs)（ROS 生态联调）
- 开发协作与智能编码：Codex（写码提效）、[GitHub Copilot](https://docs.github.com/copilot)（智能辅助）、[Git](https://git-scm.com/doc) + [GitHub Docs](https://docs.github.com/)（协作流程）、[Notion](https://www.notion.so/help) / [Obsidian](https://help.obsidian.md/) / [飞书](https://www.feishu.cn/hc)（知识沉淀）
- 硬件设计与机械建模：[嘉立创EDA](https://lceda.cn/)（原理图与 PCB）、[SolidWorks](https://www.solidworks.com/)（可选）
- 调试与效率工具：[Geek Uninstaller](https://geekuninstaller.com/)（软件清理）、浏览器插件（调试辅助）、[spacedesk](https://www.spacedesk.net/)（副屏）、[UU远程](https://uuyc.163.com/)（远程访问）
- Linux 工具链：[WSL](https://learn.microsoft.com/windows/wsl/) / [Ubuntu](https://ubuntu.com/tutorials)（统一环境）、[CMake](https://cmake.org/documentation/) + [Ninja](https://ninja-build.org/manual.html)（跨平台构建）、[tmux](https://github.com/tmux/tmux/wiki)（多终端管理）
- 机器人中间件：[ROS2](https://docs.ros.org/en/humble/index.html)（模块通信）、[RViz2](https://docs.ros.org/en/humble/Tutorials/Intermediate/RViz/RViz-Main.html)（可视化）、[rqt](https://docs.ros.org/en/humble/Concepts/About-RQt.html)（调试）

可选择性补充：

- 模型部署与推理：[ONNX Runtime](https://onnxruntime.ai/docs/)、[TensorRT](https://docs.nvidia.com/deeplearning/tensorrt/latest/)、[OpenVINO](https://docs.openvino.ai/)
- 测试与质量保障：[pytest](https://docs.pytest.org/)、[pre-commit](https://pre-commit.com/)、[GitHub Actions](https://docs.github.com/actions)

工具没有绝对好坏，关键是形成自己的稳定工作流：
从建模仿真、训练部署，到联调验证和文档协作，流程打通才是核心竞争力。
