package fr.univ.lille.fil.mbprestservice.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fr.univ.lille.fil.mbprestservice.entity.Advert;
import fr.univ.lille.fil.mbprestservice.repository.AdvertRepository;

@Service
public class AdvertService {

	@Autowired
	AdvertRepository advertRepository;

	

	public Advert save(Advert advert) {
		return advertRepository.save(advert);
	}

	public List<Advert> findAll() {
		return advertRepository.findAll();
	}
	
	public void delete(int id) {
		 advertRepository.deleteById(id);
	}
	
}
