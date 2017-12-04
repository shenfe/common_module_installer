# common_module_installer

公共模块安装器，将配置文件指定的公共模块代码同步至项目本地工作区。

## Step1: common_modules.js

配置，放置在项目根目录下，导出当前项目对所依赖的公共模块的配置。

## Step2: common_modules_install.js

脚本，放置在项目根目录下，从远程将公共模块文件同步至本地。应在每次正式构建过程发生之前执行。
