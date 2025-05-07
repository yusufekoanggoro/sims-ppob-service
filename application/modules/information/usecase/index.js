require('dotenv').config();

class InformationUsecase {
    
    constructor(informationRepository) {
      this.informationRepository = informationRepository;
    }
  
    async getBanners() {
        try {
            const foundBanners = await this.informationRepository.getBanners();

            const baseUrl = `${process.env.BASE_URL}`;
            const bannersWithBaseUrl = foundBanners.map(({ id, ...banner }) => ({
                ...banner,
                banner_image: `${baseUrl}/${banner.banner_image}`
            }));

            return bannersWithBaseUrl;
        } catch (error) {
            throw error;
        }
    }

    async getServices() {
        try {
            const foundServices = await this.informationRepository.getServices();

            const baseUrl = `${process.env.BASE_URL}`;
            const servicesWithBaseUrl = foundServices.map(({ id, ...service }) => ({
                ...service,
                service_icon: `${baseUrl}/${service.service_icon}`
            }));

            return servicesWithBaseUrl;
        } catch (error) {
            throw error;
        }
    }
  
}

module.exports = InformationUsecase;