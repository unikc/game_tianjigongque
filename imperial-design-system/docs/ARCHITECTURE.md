# Architecture decisions

IDS is a source package inside the app while the product is a single client. Its dependency direction is one-way: game screens may import IDS; IDS may not import story content or state. When a second application appears, move the folder to a workspace package without changing its public barrel.

Data registries separate stable semantic IDs from replaceable files. Engine-neutral interfaces keep audio and animation providers swappable. The `/ids` route is the executable specification; markdown records policy and production workflows.
