# ansible-ubuntu (vagrant)

## What is this?

A simple minded playbook generator for Ansible. The output assumes use of Ubuntu or another `apt-get` based os. You also
get a Vagrantfile.

After running this you can just `vagrant up` to take a look at things. You'll have to customize as you see fit. Change ips,
add roles, variables, hosts, etc. This is a jumping off point that you customize.

This is not a replacement for [Ansible Galaxy](https://galaxy.ansible.com/). This is just a suite of Ansible roles I find useful for working with Ubuntu.

Going through a restructuring to allow local `npm install` of this repo. The idea when that is done, is that all you have
to do is npm install this for general use roles. It can be version controlled through npm. Your project based roles can
be in your main repo and they can depend on the general purpose ones. So your main repo will not be cluttered with boilerplate.

Project directory structur

```
ansible
    group_vars
    project
        nginx
        node
        mongo
node_modules
    ansible_ubuntu
        ansible
            common
                ...
```

## Dependencies

You need vagrant and ansible installed:

http://vagrantup.com

Ansible:

```
sudo easy_install pip
sudo pip install ansible
```

Some of these depend on each other - you do not have to pick the dependencies. They are automatically included

* Git (2.3+)
* Elasticsearch
* Grasshopper - sets up [grasshopper-cli](https://github.com/Solid-Interactive/grasshopper-cli)
* Kibana4
* Mongo
* MySQL
* Nginx
* Node via Nvm
* Oh My ZSH
* PHP5-Fpm
* ruby (2.2)
* Sharp - with needed libvips install

## Trouble shooting

If tasks are timing out due to a slow connection, add:

```
  async: 1800
```

You will have to break apart tasks `with_items` to indvidual ones.

Since this uses node via nvm, you have to source ~/.zshrc (to load nvm) before any node or npm related task.