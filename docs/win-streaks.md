# Win Streaks Feature

## Prompts (verbatim)

1. > I want to work on a new feature for my app for win streaks. I want current win streak (i.e. is it active) and longest per player, maybe some win details like dates of games and which character won. Since there are so many details, maybe do details in a daisy ui pop up modal or suggest something better. Don't do builds - just change the code on the current branch and I will run and test. My instinct is that 0 or 1 wins are not streaks, but am open to suggestions.

2. > Update the win streak to include a broken by the person as part of the fun fact in the modal i.e. Streak broken by _____ on ______ date etc. Also, make the current win not a flame, but a wand as a basic vector image with no green background. I still need to apply overal styles more

3. > create win-streaks.md with my exact prompts and a summary of the interesting decisions you made for me, and discussed with me. Also, Make the wand icon a bit thicker/more distinct, to the right of the number. Also, fix the axe-linter issue in home - table header text should not be empty

## Interesting decisions

- **Modal for details:** a DaisyUI `<dialog>` modal keeps the home table compact while showing each win's date and character. A single shared dialog is reused for all players.
- **Minimum streak of 2:** 0 or 1 wins are not streaks (`MIN_STREAK_LENGTH` in `GameResults.ts`, easy to change). Players below that show "—".
- **Games sat out are skipped:** streaks count only games the player took part in, ordered by end time. Missing a game neither extends nor breaks a streak; any loss resets it.
- **Current = active:** a streak is current only if the player's most recent game was a win and the run is at least 2.
- **Ties for longest:** the earliest streak is kept.
- **Streak breaker:** the winner of the first game the player lost after their longest streak, with that game's date. Not shown when the longest streak is still active.
- **Wand icon:** a small inline SVG using `currentColor` (no background, follows the theme), placed right of the count with a thicker stroke.
- **Accessibility:** the empty table header for the Details button column now has screen-reader-only text ("Details") to satisfy axe.
- **Sorting:** rows sort by current streak, then longest, then name.
- **No builds:** changes were only type-checked; testing is left to you.
