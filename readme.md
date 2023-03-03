# Phaser bitmap font generator

## start

```bash
	# 修改 generate-bitmapfont.js 中的 function ， 一次只可產生個字型 需要分次執行
	yarn start
```

## 安裝

- 安裝失敗 https://github.com/Automattic/node-canvas/issues/1065

### Windows or Docker

```bash
	yarn docker:build
	yarn docker:sh ## 進入 docker
	yarn install
	yarn start
```

### MAC 不推薦

需要安裝 xcode command line tools

```bash
	xcode-select --install
```

安裝 node-canvas 依賴工具

```bash
	brew install pkgconfig
	brew install pixman
	brew install cairo
	brew install pango

	yarn install
	yarn start
```
