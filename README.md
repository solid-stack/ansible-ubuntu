# ansible-ubuntu (vagrant)

## What is this?

A simple minded playbook generator for Ansible. The output assume use of Ubuntu or another `apt-get` based os. You also
get a Vagrantfile.

After running this you can just `vagrant up` to take a look at things. You'll have to customize as you see fit. Change ips,
add roles, variables, hosts, etc. This is a jumping off point that you customize.

## Example:

```shell
npm install -g ansible-ubuntu
ansible-ubuntu -v
vagrant up
vagrant ssh
```

## How do I run it?

1. `npm install -g ansible-ubuntu`
1. `cd` into the directory you want to use. The directory will get an `ansible` directory filled with roles and a `Vagrantfile`.
1. `ansible-ubuntu` will let you pick the roles you want included. There a suite of default roles always included.
    
All the roles are generally setting up the environment. For project specific stuff (e.g. sites-available / enable), I'd
suggest create a separate role that depends on of the main roles (e.g. `nginx-project` where meta has an `nginx` dependency).

## What will be created?

1. A directory called `ansible` filled with the roles you picked plus some default roles.
1. In the `ansible` dir, a hosts file setup for Vagrant setting the local ip to `192.168.99`
1. In the `ansible` dir, a `site.yml` listing the roles you picked.
1. A `Vagrantfile` tuned for a Mac host.

## Future Plans

Make things more configurable.

For example allow setting of local Vagrant ip, add more hosts, add some templating options...

## List of roles

Some of these depend on each other - you do not have to pick the dependencies. They are automatically included

* Git (2.3+)
* Elasticsearch
* Mongo
* MySQL
* Nginx
* Node
* Oh My ZSH
* PHP5-Fpm
* ruby (2.2)