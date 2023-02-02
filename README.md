# 2048 game test
by Paolo Moretti

## Run the test
You can find the test deployed and running [here](https://paolomoretti.github.io/2048-test/ "Test on Github").

To see the local dev version, please run `npm run start`.

To run tests: `npm run test`.

## Technical solution

As the game is quite simple in logic and presentation, I opted for a quick `create-react-app` solution with `typescript` support.

The front-end is rendered using `React`, which includes everything that I need without additional libraries: 
* light components
* ability to share a context
* a simple reducer that would help organise the state changes

Given the UI I opted for css modules to style the components, as the app grows I would probably switch to other solutions as I don't find it scalable enough.

## The game

Having played 2048 quite a bit in the past, I was excited about this challenge.

My excitement pushed me into going slightly off a couple of the original specs:
* Specification #4: new tiles should have a value of 1. I set it to 2s with sporadic 4s as per the original game (which just made my life a little harder :))
* Specification #6: the game is won when value is 2048. I still let the user play even though I notify of the winning

I hope it's not a problem.

## Bonus tasks

I took 2 bonus tasks on: the random obstacles and the custom grid size.

They are both easy to implement, and they don't require any additional library or more advanced deployment solutions to run, so I opted for focusing on just these two.

## Improvements

There are some improvements that I had in mind and I wanted to list them here, but I traded them out of the exercise for time balance.

### Separation of logic
Ideally, the game logic should be more decoupled from the presentation and probably pulled out in a separate provider for simplicity and re-usability. 

### Tests
I normally start code/back-end logic by writing tests first, to cover my specs. 

Given the nature of the exercise (a game), I felt it more natural to start from the UI components, which I normally code first, test in a browser, and then I add automated tests using enzyme or react test library to validate the behaviour and specs.

As I progressively incremented the app, I was relying more and more on manual browser tests, and I neglected the TDD approach that I would normally use in a business context.

I decided to add examples of how I would normally test logics and components:
* src/utils/boardMatrix.spec.ts
* src/components/Tile.test.tsx

(as described above, you can run `npm run test` to see them both running)


### Responsiveness
I've added basic responsiveness to make sure the game would be ok for all meaningful desktop screens, but it could be improved further to adapt the font-sizes to the screen and a number of other tweaks.

### Mobile
A touch library to subscribe to up/right/down/left swipes would have enabled the game to any mobile/touch device.
 
