package fr.univ.lille.fil.mbprestservice.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Entité qui définit le type Banni représentant un utilisateur
 * banni par son adresse mail
 * @author Rem
 *
 */
@Entity
@Table(name = "banni")
public class Banni {
	
	@Id
	private String email;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public String toString() {
		return "Banni [email=" + email + "]";
	}
	
	

}
