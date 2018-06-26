
all:clean target


target:
	NODE_ENV=production webpack
	cp public/package.json build/
	cp public/index.js build/
	cp src/css build/static -rf
	cp src/media build/static -rf
	cp src/fonts build/static -rf
	@echo please run \"electron build\" now

force:clean all


debug:
	NODE_ENV=development electron -r babel-register test

run:all
	electron build

clean:
	rm build/* -rf