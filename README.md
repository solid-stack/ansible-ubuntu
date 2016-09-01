# ansible-ubuntu (vagrant)

Requires Ansible 2.1 or greater.

## What is this?

A set of Ansible roles for Ubuntu you can `npm install` locally.

To have Ansible check `node_modules/ansible-ubuntu` for roles add a file called `ansible.cfg` into the root of your project:
 
```
[defaults]

roles_path = node_modules/ansible-ubuntu/ansible
hash_behaviour = merge
```

Note that the merge hash behavior [allows you to override on value in a dictionary](http://stackoverflow.com/a/25131711/186636).
http://docs.ansible.com/ansible/intro_configuration.html#hash-behaviour

Then create a `Vagrantfile` (you can use `Vagrantfile.sample` to get started).

In your `site.yml` and in your meta dirs you can refer to the `ansible-ubuntu` roles, e.g.:

```
---

- name: Setup Solid Aggregator Stack
  hosts: vagrant
  sudo: yes
  roles:
    - common/oh-my-zsh
    - common/elasticsearch
```

If you add project level roles into your directory, then they can pull in these general purpose roles as follows:

`project/nginx/tasks/meta/main.yml`

```
---
dependencies:
   - { role: 'common/nginx'}
```

The roles have set defaults for the variables you can modify. Just look in the `defaults` dir of each node.

There is a `provision` binary that is included. `-h` for help.

Once this is setup, you can just `vagrant up`. The initial `vagrant up` will also provision things. Once the box exists
you can `vagrant provision` to reprovision.

This is not meant to be a replacement for [Ansible Galaxy](https://galaxy.ansible.com/). This is just a suite of Ansible roles I find useful for working with Ubuntu. 

## Dependencies

You need vagrant and ansible installed:

http://vagrantup.com

Ansible:

```
sudo easy_install pip
sudo pip install ansible
```

Some of these depend on each other

* Elasticsearch
* Git (2.3+)
* Grasshopper - sets up [grasshopper-cli](https://github.com/Solid-Interactive/grasshopper-cli)
* Java 8
* Kibana4
* Mongo
* MySQL
* Nginx
* Node via Nvm
* Oh My ZSH
* PHP5-Fpm
* ruby (2.2)
* Sharp - with needed libvips install

* Mongo
    * Single Instance
    * Authorization enabled
    
        ```
        mongo:
          journaling: "false"
          root_admin_name: "root"
          root_admin_password: "sample root password"
          backup_name: "backup"
          backup_password: "sample backup password"
          version: "3.2" # can be 3.0 or 3.2
        ```

## Trouble shooting

If tasks are timing out due to a slow connection, add:

```
  async: 1800
```

You will have to break apart tasks `with_items` to indvidual ones.

Since this uses node via nvm, you have to source ~/.zshrc (to load nvm) before any node or npm related task.