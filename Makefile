
start:
	npm start

publish:
	git add --all
	git commit -m "Publish changes @deploytoserver"
	git push

.PHONY: publish start
