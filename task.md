Within our feature next project, more specifically the adjust package,
you can see some `TODO: fix upstream notations`.
I linked Comunica locally (using workspaces), you are tasked to upstream the changes we made to Comunica and commit them there.  
Afterward, make sure you update the adjust package so it uses the upstreamed utility functions instead of redefining them.

Alongside those changes, you can see that in the tests of our adjust package we have utils that we copied from Comunica with slight changes.
You are tasked to also update the Comunica source code to incorporate the required changes so we can provide our own parser setup to the generalEvaluation utils etc. Again, commit your changes on the comunica monorepo, after that you should modify the local adjust package tests to use the upstream utils instead.
