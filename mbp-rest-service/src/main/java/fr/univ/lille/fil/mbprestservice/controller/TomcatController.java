package fr.univ.lille.fil.mbprestservice.controller;

import java.util.Collection;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import fr.univ.lille.fil.mbprestservice.entity.Advert;
import fr.univ.lille.fil.mbprestservice.repository.AdvertRepository;
import fr.univ.lille.fil.mbprestservice.requestbody.CreateAdvertBody;

@RestController
public class TomcatController {

	@GetMapping("/")
	public String welcomeMessage() {
		return "Bienvenue sur l'api rest MyBodyPartner";
	}
}