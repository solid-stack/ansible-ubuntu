# -*- mode: ruby -*-
# vi: set ft=ruby :
# Vagrant plugins used:
# vagrant-exec
# vagrant-vbguest

Vagrant.configure("2") do |config|
  config.vbguest.auto_update = true

  # do NOT download the iso file from a webserver
  config.vbguest.no_remote = false

  config.vm.provider "virtualbox" do |v|
      v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant", "1"]

      host = RbConfig::CONFIG['host_os']

        # Give VM 1/4 system memory & access to all cpu cores on the host
        if host =~ /darwin/
          cpus = `sysctl -n hw.ncpu`.to_i
          # sysctl returns Bytes and we need to convert to MB
          mem = `sysctl -n hw.memsize`.to_i / 1024 / 1024 / 4
        elsif host =~ /linux/
          cpus = `nproc`.to_i
          # meminfo shows KB and we need to convert to MB
          mem = `grep 'MemTotal' /proc/meminfo | sed -e 's/MemTotal://' -e 's/ kB//'`.to_i / 1024 / 4
        else # sorry Windows folks, I can't help you
          cpus = 2
          mem = 1024
        end

        v.customize ["modifyvm", :id, "--memory", mem]
        v.customize ["modifyvm", :id, "--cpus", cpus]
  end

  config.vm.box = "ubuntu/trusty64"

  config.vm.network :forwarded_port, guest: 80, host: 8080, auto_correct: true
  config.vm.network :forwarded_port, guest: 3306, host: 8306, auto_correct: true

  config.vm.network "private_network", ip: "192.168.99.99"
  config.vm.synced_folder "./", "/var/www/vhosts/example/source", nfs: true

  config.vm.provision :ansible do |ansible|
     ansible.playbook = "ansible/site.yml"
     ansible.inventory_path = "ansible/hosts"
     ansible.limit = "vagrant"
     ansible.verbose = "v"
  end
end
