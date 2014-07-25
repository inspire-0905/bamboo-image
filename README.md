bamboo-image
============

bamboo image service

## Test
```
make test
```

## API List
参数可以是JSON，也可以是x-www-form-urlencoded，form-data

```
POST /upload

params:
	url: image_url

return:
	url: image url,
	width: origin image width,
	height: origin image height
```

```
POST /upload

params:
	filename: image filename (required)
	image: image content, base64 encoded (required)

return:
	url: image url,
	width: origin image width,
	height: origin image height
```